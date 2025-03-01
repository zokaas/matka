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

const VALID_REACTION_TYPES = [
  'like',
  'support',
  'celebrate',
  'inspire',
  'focus',
  'determination',
  'teamwork',
  'global',
  'love',
  'speed',
  'strong',
];

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
    try {
      this.logger.log(`Fetching reactions for activity: ${activityId}`);

      // Validate activity ID
      const numericActivityId = parseInt(activityId, 10);
      if (isNaN(numericActivityId)) {
        this.logger.error(`Invalid activity ID: ${activityId}`);
        throw new HttpException('Invalid activity ID', HttpStatus.BAD_REQUEST);
      }

      // Find activity with comprehensive error handling
      const activity = await this.activityRepository.findOne({
        where: { id: numericActivityId },
        relations: ['reactions'],
      });

      if (!activity) {
        this.logger.warn(`Activity not found: ${numericActivityId}`);
        return []; // Return empty array instead of throwing an error
      }

      // Count reactions by type
      const reactionCounts = activity.reactions.reduce((acc, reaction) => {
        if (!acc[reaction.type]) {
          acc[reaction.type] = 0;
        }
        acc[reaction.type]++;
        return acc;
      }, {});

      // Ensure all valid reaction types are represented
      VALID_REACTION_TYPES.forEach((type) => {
        if (!(type in reactionCounts)) {
          reactionCounts[type] = 0;
        }
      });

      const result = Object.entries(reactionCounts).map(([type, count]) => ({
        type,
        count,
      }));

      this.logger.log(
        `Reactions for activity ${activityId}: ${JSON.stringify(result)}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error fetching reactions: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        {
          message: 'Unable to fetch reactions',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':activityId/reactions')
  async handleReaction(
    @Param('activityId') activityId: string,
    @Body() reactionData: { type: string; action: 'add' | 'remove' },
  ) {
    try {
      this.logger.log(
        `Handling reaction for activity: ${activityId}, Data: ${JSON.stringify(reactionData)}`,
      );

      // Validate input
      if (!reactionData || !reactionData.type || !reactionData.action) {
        this.logger.error('Invalid reaction data', reactionData);
        throw new HttpException(
          'Invalid reaction data',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate reaction type
      if (!VALID_REACTION_TYPES.includes(reactionData.type)) {
        this.logger.error(`Invalid reaction type: ${reactionData.type}`);
        throw new HttpException(
          'Invalid reaction type',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Convert and validate activity ID
      const numericActivityId = parseInt(activityId, 10);
      if (isNaN(numericActivityId)) {
        this.logger.error(`Invalid activity ID: ${activityId}`);
        throw new HttpException('Invalid activity ID', HttpStatus.BAD_REQUEST);
      }

      // Find the activity
      const activity = await this.activityRepository.findOne({
        where: { id: numericActivityId },
      });

      if (!activity) {
        this.logger.warn(`Activity not found: ${numericActivityId}`);
        throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
      }

      if (reactionData.action === 'add') {
        // Create a new reaction
        const reaction = this.reactionRepository.create({
          type: reactionData.type,
          activity,
        });

        const savedReaction = await this.reactionRepository.save(reaction);

        this.logger.log(`Reaction added: ${JSON.stringify(savedReaction)}`);

        return {
          success: true,
          added: true,
          type: reactionData.type,
        };
      } else if (reactionData.action === 'remove') {
        // Remove the most recently created reaction of this type for the activity
        const reactionToRemove = await this.reactionRepository.findOne({
          where: {
            activity: { id: activity.id },
            type: reactionData.type,
          },
          order: { createdAt: 'DESC' },
        });

        if (reactionToRemove) {
          await this.reactionRepository.remove(reactionToRemove);
          this.logger.log(
            `Reaction removed: ${JSON.stringify(reactionToRemove)}`,
          );
        } else {
          this.logger.warn(
            `No reaction to remove for type: ${reactionData.type}`,
          );
        }

        return {
          success: true,
          added: false,
          type: reactionData.type,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error processing reaction: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        {
          message: 'Unable to process reaction',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
