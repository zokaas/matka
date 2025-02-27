import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { Reaction } from './reaction.entity';

@Controller('activity')
export class ReactionsController {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
  ) {}

  @Get(':activityId/reactions')
  async getActivityReactions(@Param('activityId') activityId: string) {
    const activity = await this.activityRepository.findOne({
      where: { id: parseInt(activityId, 10) },
      relations: ['reactions'],
    });

    if (!activity) {
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    }

    // Group reactions by type and count
    const reactionCounts = activity.reactions.reduce((acc, reaction) => {
      if (!acc[reaction.type]) {
        acc[reaction.type] = 0;
      }
      acc[reaction.type]++;
      return acc;
    }, {});

    return Object.entries(reactionCounts).map(([type, count]) => ({
      type,
      count,
    }));
  }

  @Post(':activityId/reactions')
  async toggleReaction(
    @Param('activityId') activityId: string,
    @Body() reactionData: { type: string },
  ) {
    const activity = await this.activityRepository.findOne({
      where: { id: parseInt(activityId, 10) },
    });

    if (!activity) {
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    }

    const existingReaction = await this.reactionRepository.findOne({
      where: {
        activity: { id: activity.id },
        type: reactionData.type,
      },
    });

    if (existingReaction) {
      // Remove existing reaction if it exists
      await this.reactionRepository.remove(existingReaction);
      return { added: false, type: reactionData.type };
    }

    // Create new reaction
    const reaction = this.reactionRepository.create({
      type: reactionData.type,
      activity,
    });

    await this.reactionRepository.save(reaction);
    return { added: true, type: reactionData.type };
  }
}
