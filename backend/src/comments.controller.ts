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
import { Comment } from './comment.entity';

@Controller('activity')
export class CommentsController {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  // In src/comments.controller.ts
  @Get(':activityId/comments')
  async getActivityComments(@Param('activityId') activityId: string) {
    const parsedId = parseInt(activityId, 10);

    // More efficient query using the new index
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.activity = :activityId', { activityId: parsedId })
      .orderBy('comment.createdAt', 'DESC')
      .getMany();

    return comments;
  }

  @Post(':activityId/comments')
  async addComment(
    @Param('activityId') activityId: string,
    @Body() commentData: { text: string },
  ) {
    const activity = await this.activityRepository.findOne({
      where: { id: parseInt(activityId, 10) },
    });

    if (!activity) {
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    }

    const comment = this.commentRepository.create({
      text: commentData.text,
      activity,
    });

    return await this.commentRepository.save(comment);
  }
}
