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

  @Get(':activityId/comments')
  async getActivityComments(@Param('activityId') activityId: string) {
    console.log(`Fetching comments for activity: ${activityId}`);
    const activity = await this.activityRepository.findOne({
      where: { id: parseInt(activityId, 10) },
      relations: ['comments'],
    });
    console.log('Activity found:', activity);

    if (!activity) {
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    }

    // Sort comments by date (newest first)
    const sortedComments = activity.comments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return sortedComments;
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

    const savedComment = await this.commentRepository.save(comment);

    return savedComment;
  }
}
