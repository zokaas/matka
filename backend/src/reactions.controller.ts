import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { Reaction } from './reaction.entity';

// Define interfaces for error and query results
interface ErrorWithMessage {
  message: string;
}

interface ReactionCount {
  type: string;
  count: number;
}

@Controller('activity')
export class ReactionsController {
  private readonly logger = new Logger(ReactionsController.name);

  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
  ) {}

  @Get(':activityId/reactions')
  async getActivityReactions(@Param('activityId') activityId: string) {
    this.logger.log(`Fetching reactions for activity ${activityId}`);

    try {
      // First check if the activity exists
      const activity = await this.activityRepository.findOne({
        where: { id: parseInt(activityId, 10) },
      });

      this.logger.log(`Activity found: ${activity ? 'Yes' : 'No'}`);

      if (!activity) {
        throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
      }

      // Use a direct query to get reaction counts
      const reactions = await this.reactionRepository.find({
        where: { activityId: parseInt(activityId, 10) },
      });

      this.logger.log(`Found ${reactions.length} reactions`);

      // Count reactions by type
      const reactionCounts = reactions.reduce(
        (acc: Record<string, number>, reaction: Reaction) => {
          acc[reaction.type] = (acc[reaction.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return Object.entries(reactionCounts).map(([type, count]) => ({
        type,
        count,
      }));
    } catch (error) {
      const typedError = error as ErrorWithMessage;
      this.logger.error('Error fetching reactions:', typedError);
      throw new HttpException(
        `Failed to retrieve reactions: ${typedError.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':activityId/reactions')
  async addReaction(
    @Param('activityId') activityId: string,
    @Body() reactionData: { type: string },
  ) {
    this.logger.log(
      `Adding reaction to activity ${activityId}: ${JSON.stringify(reactionData)}`,
    );

    try {
      // Check if activity exists
      const activity = await this.activityRepository.findOne({
        where: { id: parseInt(activityId, 10) },
      });

      if (!activity) {
        throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
      }

      // Create a new reaction - always add a new one
      const reaction = new Reaction();
      reaction.activityId = parseInt(activityId, 10);
      reaction.type = reactionData.type;

      const savedReaction = await this.reactionRepository.save(reaction);
      this.logger.log(`Saved reaction: ${JSON.stringify(savedReaction)}`);

      return { added: true, type: reactionData.type };
    } catch (error) {
      const typedError = error as ErrorWithMessage;
      this.logger.error('Error adding reaction:', typedError);
      throw new HttpException(
        `Failed to add reaction: ${typedError.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Fallback method with raw SQL if the repository methods aren't working
  @Get(':activityId/reactions/raw')
  async getRawReactions(@Param('activityId') activityId: string) {
    this.logger.log(`Fetching raw reactions for activity ${activityId}`);

    try {
      // Use raw SQL to get reaction counts
      const rawResults = (await this.reactionRepository.query(
        `
        SELECT type, COUNT(*) as count
        FROM reaction
        WHERE "activityId" = $1
        GROUP BY type
      `,
        [parseInt(activityId, 10)],
      )) as ReactionCount[];

      this.logger.log(`Raw query results: ${JSON.stringify(rawResults)}`);

      // Explicitly type the return value and type-check the arguments
      return rawResults.map((row: ReactionCount) => ({
        type: row.type,
        count: parseInt(String(row.count), 10),
      }));
    } catch (error: unknown) {
      const typedError = error as ErrorWithMessage;
      this.logger.error('Error in raw query:', typedError);
      throw new HttpException(
        `Failed to retrieve reactions: ${typedError.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
