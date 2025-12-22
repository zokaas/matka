import { Injectable, Logger } from "@nestjs/common";
import { InjectRedis } from "@songkeys/nestjs-redis";
import { Redis } from "ioredis";
import {
  NL_PIPELINE_KC_CLIENT_ID,
  NL_REALM,
  NL_REDIS_ACTIVE_APPLICATIONS,
  NL_REDIS_HANDLE_APPLICATIONS_LIST_LOCK,
  NL_REDIS_HANDLED_APPLICATIONS,
  NL_REDIS_REJECTED_APPLICATIONS,
  NL_REDIS_VILJA_DONE_APPLICATIONS,
} from "../helpers";
import { ApplicationListEntity } from "../entities";

@Injectable()
export class HandleApplicationsInRedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private readonly logger = new Logger(HandleApplicationsInRedisService.name);

  async getApplicationListObject(): Promise<ApplicationListEntity> {
    const isListUnlocked = await this.redis.setnx(
      NL_REDIS_HANDLE_APPLICATIONS_LIST_LOCK,
      "true"
    );
    const applicationList: ApplicationListEntity = new ApplicationListEntity({
      realm: NL_REALM,
      kcClientId: NL_PIPELINE_KC_CLIENT_ID,
      applications: [],
      listLocked: false,
    });
    if (isListUnlocked === 1) {
      await this.redis.expire(NL_REDIS_HANDLE_APPLICATIONS_LIST_LOCK, 295);
      const list = await this.redis.smembers(NL_REDIS_ACTIVE_APPLICATIONS);

      if (list.length > 0) applicationList.applications = list;
    } else {
      applicationList.listLocked = true;
    }
    return applicationList;
  }

  async moveApplicationIdToViljaDone(id: string): Promise<void> {
    await this.redis.smove(
      NL_REDIS_ACTIVE_APPLICATIONS,
      NL_REDIS_VILJA_DONE_APPLICATIONS,
      id
    );
  }

  async moveApplicationIdToDone(id: string): Promise<void> {
    await this.redis.smove(
      NL_REDIS_VILJA_DONE_APPLICATIONS,
      NL_REDIS_HANDLED_APPLICATIONS,
      id
    );
  }

  async moveApplicationIdToRejected(id: string): Promise<void> {
    await this.redis.smove(
      NL_REDIS_ACTIVE_APPLICATIONS,
      NL_REDIS_REJECTED_APPLICATIONS,
      id
    );
  }
}
