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
    } catch (error) {
      console.error('Error getting reactions:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error processing reaction request',
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
      console.log(
        `Toggling reaction for activity ${activityId}:`,
        reactionData,
      );

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

      const savedReaction = await this.reactionRepository.save(reaction);
      console.log('Reaction saved:', savedReaction);

      return { added: true, type: reactionData.type };
    } catch (error) {
      console.error('Error processing reaction:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error processing reaction request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
