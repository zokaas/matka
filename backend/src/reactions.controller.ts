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
    try {
      const activity = await this.activityRepository.findOne({
        where: { id: parseInt(activityId, 10) },
        relations: ['reactions'],
      });

      if (!activity) {
        throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
      }

      // ✅ Explicitly typing reactionCounts as Record<string, number>
      const reactionCounts: Record<string, number> = activity.reactions.reduce(
        (acc: Record<string, number>, reaction) => {
          acc[reaction.type] = (acc[reaction.type] || 0) + 1;
          return acc;
        },
        {},
      );

      return Object.entries(reactionCounts).map(([type, count]) => ({
        type,
        count,
      }));
    } catch (error: unknown) {
      console.error('Error fetching reactions:', error);
      throw new HttpException(
        'Failed to retrieve reactions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':activityId/reactions')
  async toggleReaction(
    @Param('activityId') activityId: string,
    @Body() reactionData: { type: string },
  ) {
    try {
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

      const currentTime = new Date();

      if (existingReaction) {
        // ✅ Ensure that createdAt is correctly handled
        if (!existingReaction.createdAt) {
          throw new HttpException(
            'Reaction does not have a valid timestamp',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        const sessionExpiresAt = new Date(existingReaction.createdAt);
        sessionExpiresAt.setMinutes(sessionExpiresAt.getMinutes() + 5);

        if (currentTime <= sessionExpiresAt) {
          await this.reactionRepository.remove(existingReaction);
          return { added: false, type: reactionData.type };
        } else {
          return {
            added: true,
            type: reactionData.type,
            message: 'Reactions are now permanent after session expiration.',
          };
        }
      }

      // ✅ Ensure createdAt is properly set
      const reaction = this.reactionRepository.create({
        type: reactionData.type,
        activity,
        createdAt: currentTime, // Explicitly set creation time
      });

      await this.reactionRepository.save(reaction);
      return { added: true, type: reactionData.type };
    } catch (error: unknown) {
      console.error('Error processing reaction:', error);
      throw new HttpException(
        'Failed to process reaction request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
