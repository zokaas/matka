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

      // Group reactions by type to get unique timestamps
      const reactionDetails = activity.reactions.reduce(
        (
          acc: Record<string, { count: number; createdAts: string[] }>,
          reaction,
        ) => {
          if (!acc[reaction.type]) {
            acc[reaction.type] = { count: 0, createdAts: [] };
          }
          acc[reaction.type].count++;
          acc[reaction.type].createdAts.push(reaction.createdAt.toISOString());
          return acc;
        },
        {},
      );

      return Object.entries(reactionDetails).map(([type, details]) => ({
        type,
        count: details.count,
        createdAts: details.createdAts,
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
      const activity = await this.activityRepository.findOne({
        where: { id: parseInt(activityId, 10) },
      });

      if (!activity) {
        throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
      }

      // Always create a new reaction
      const reaction = this.reactionRepository.create({
        type: reactionData.type,
        activity,
        createdAt: new Date(), // Always use current timestamp
      });

      await this.reactionRepository.save(reaction);

      // Fetch updated reactions to return current state
      const updatedReactions = await this.reactionRepository.find({
        where: { activity: { id: activity.id } },
      });

      // Group reactions to get counts
      const reactionCounts = updatedReactions.reduce(
        (acc: Record<string, number>, r) => {
          acc[r.type] = (acc[r.type] || 0) + 1;
          return acc;
        },
        {},
      );

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
