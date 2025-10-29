import React from 'react';
import { Box, Flex, Typography, EmptyStateLayout } from '@strapi/design-system';
import { useNotification } from '@strapi/strapi/admin';
import QuestionCard from './QuestionCard';
import { deleteQuestion } from '../../api/questions';

interface QuestionListProps {
  questions: any[];
  onEdit: (question: any) => void;
  onRefresh: () => void;
  locale: string;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onEdit,
  onRefresh,
  locale,
}) => {
  const { toggleNotification } = useNotification();

  const handleDelete = async (question: any) => {
    if (!window.confirm(`Are you sure you want to delete "${question.questionLabel}"?`)) {
      return;
    }

    try {
      await deleteQuestion(question.documentId, locale);
      toggleNotification({
        type: 'success',
        message: 'Question deleted successfully',
      });
      onRefresh();
    } catch (error) {
      toggleNotification({
        type: 'danger',
        message: 'Failed to delete question',
      });
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <Box padding={8} style={{ textAlign: 'center' }}>
        <Typography variant="omega" textColor="neutral600">
          No questions yet. Click "Create New Question" to add one.
        </Typography>
      </Box>
    );
  }

  return (
    <Flex direction="column" gap={3}>
      {questions.map((question) => (
        <QuestionCard
          key={question.documentId}
          question={question}
          onEdit={() => onEdit(question)}
          onDelete={() => handleDelete(question)}
        />
      ))}
    </Flex>
  );
};

export default QuestionList;