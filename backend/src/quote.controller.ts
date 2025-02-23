import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from './quote.entity'; // Import the Quote entity

@Controller('quotes') // ✅ Set 'quotes' as the prefix
export class QuoteController {
  constructor(
    @InjectRepository(Quote)
    private quoteRepository: Repository<Quote>,
  ) {}

  // ✅ Fetch All Quotes
  @Get()
  async getAllQuotes() {
    try {
      console.log('Fetching all quotes from database...'); // Debug Log
      const quotes = await this.quoteRepository.find();
      console.log('Quotes retrieved:', quotes); // Debug Log
      return quotes;
    } catch (err) {
      console.error('Error fetching quotes:', err);
      throw new HttpException(
        'Failed to fetch quotes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Submit a New Quote
  @Post()
  async addQuote(@Body() quoteData: { text: string }) {
    console.log('Received new quote:', quoteData); // Debug Log

    if (!quoteData.text) {
      throw new HttpException('Quote cannot be empty', HttpStatus.BAD_REQUEST);
    }

    try {
      const newQuote = this.quoteRepository.create({ text: quoteData.text });
      const savedQuote = await this.quoteRepository.save(newQuote);
      console.log('Saved to database:', savedQuote); // Debug Log
      return savedQuote;
    } catch (err) {
      console.error('Error saving quote:', err);
      throw new HttpException(
        'Failed to save quote',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
