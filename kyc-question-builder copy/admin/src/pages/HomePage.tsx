import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Layout,
  Main,
  HeaderLayout,
  ContentLayout,
  Flex,
  Typography,
} from '@strapi/design-system';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';  // Updated import
import { Plus } from '@strapi/icons';
import { useNotification } from '@strapi/strapi/admin';
import QuestionList from '../components/QuestionList';
import QuestionBuilder from '../components/QuestionBuilder';
import { fetchQuestions } from '../api/questions';

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [locale, setLocale] = useState('se');
  const [isLoading, setIsLoading] = useState(false);
  const { toggleNotification } = useNotification();

  useEffect(() => {
    loadQuestions();
  }, [locale]);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchQuestions(locale);
      setQuestions(data);
    } catch (error) {
      toggleNotification({
        type: 'danger',
        message: 'Failed to load questions',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingQuestion(null);
    setIsBuilderOpen(true);
  };

  const handleEdit = (question: any) => {
    setEditingQuestion(question);
    setIsBuilderOpen(true);
  };

  const handleClose = () => {
    setIsBuilderOpen(false);
    setEditingQuestion(null);
    loadQuestions();
  };

  return (
    <Layout>
      <Main>
        <HeaderLayout
          title="KYC Question Builder"
          subtitle="Create and manage KYC questions with validation"
          primaryAction={
            <Button
              startIcon={<Plus />}
              onClick={handleCreate}
            >
              Create New Question
            </Button>
          }
        />
        <ContentLayout>
          <Box padding={8}>
            <Flex direction="column" gap={4}>
              <Box>
                <SingleSelect
                  label="Locale"
                  value={locale}
                  onChange={setLocale}
                >
                  <SingleSelectOption value="se">Swedish (SE)</SingleSelectOption>
                  <SingleSelectOption value="fi">Finnish (FI)</SingleSelectOption>
                </SingleSelect>
              </Box>
              
              {isLoading ? (
                <Box padding={8} style={{ textAlign: 'center' }}>
                  <Typography>Loading...</Typography>
                </Box>
              ) : (
                <QuestionList
                  questions={questions}
                  onEdit={handleEdit}
                  onRefresh={loadQuestions}
                  locale={locale}
                />
              )}
            </Flex>
          </Box>

          {isBuilderOpen && (
            <QuestionBuilder
              question={editingQuestion}
              locale={locale}
              onClose={handleClose}
            />
          )}
        </ContentLayout>
      </Main>
    </Layout>
  );
};

export { HomePage };