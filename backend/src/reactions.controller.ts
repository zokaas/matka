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

      // Group reactions by type
      const reactionDetails = activity.reactions.reduce(
        (acc: Record<string, number>, reaction) => {
          acc[reaction.type] = (acc[reaction.type] || 0) + 1;
          return acc;
        },
        {},
      );

      // Convert to array of reactions with consistent structure
      // matching what the frontend expects
      return Object.entries(reactionDetails).map(([type, count]) => ({
        type,
        count,
      }));
    } catch (error) {
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
      // Find the activity
      const activity = await this.activityRepository.findOne({
        where: { id: parseInt(activityId, 10) },
      });

      if (!activity) {
        throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
      }

      // Create a new reaction
      const reaction = this.reactionRepository.create({
        type: reactionData.type,
        activity,
        createdAt: new Date(),
      });

      // Save the new reaction
      await this.reactionRepository.save(reaction);

      // Fetch updated reactions for this activity
      const updatedReactions = await this.reactionRepository.find({
        where: { activity: { id: activity.id } },
      });

      // Group reactions by type
      const reactionCounts = updatedReactions.reduce(
        (acc: Record<string, number>, r) => {
          acc[r.type] = (acc[r.type] || 0) + 1;
          return acc;
        },
        {},
      );

      // Ensure we return the exact structure expected by the frontend
      return {
        added: true,
        type: reactionData.type,
        currentReactions: Object.entries(reactionCounts).map(
          ([type, count]) => ({
            type,
            count,
          }),
        ),
      };
    } catch (error) {
      console.error('Error processing reaction:', error);
      throw new HttpException(
        'Failed to process reaction request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
