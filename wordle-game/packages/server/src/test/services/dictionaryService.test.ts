/// <reference types="jest" />
import axios from 'axios';
import { DictionaryService } from '../../services/dictionaryService';
import { logger } from '../../utils/logger';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('DictionaryService', () => {
  let dictionaryService: DictionaryService;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv }; // Make a copy of process.env
    dictionaryService = new DictionaryService();
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original process.env
  });

  describe('wordExists', () => {
    it('should return true for a known valid English word if API is configured and returns 200', async () => {
      process.env.DICTIONARY_API_URL = 'http://mockapi.com';
      process.env.DICTIONARY_API_KEY = 'mockkey';
      dictionaryService = new DictionaryService(); // Re-initialize to pick up new env vars

      mockedAxios.get.mockResolvedValueOnce({ status: 200 });

      const exists = await dictionaryService.wordExists('hello');
      expect(exists).toBe(true);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://mockapi.com/entries/en/hello',
        { headers: { app_id: 'mockkey', app_key: 'mockkey' } }
      );
    });

    it('should return false for a nonsensical word if API is configured and returns non-200', async () => {
      process.env.DICTIONARY_API_URL = 'http://mockapi.com';
      process.env.DICTIONARY_API_KEY = 'mockkey';
      dictionaryService = new DictionaryService();

      mockedAxios.get.mockResolvedValueOnce({ status: 404 });

      const exists = await dictionaryService.wordExists('asdfg');
      expect(exists).toBe(false);
    });

    it('should return false and log a warning if the API is not configured', async () => {
      delete process.env.DICTIONARY_API_URL;
      delete process.env.DICTIONARY_API_KEY;
      dictionaryService = new DictionaryService();

      const exists = await dictionaryService.wordExists('test');
      expect(exists).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith('Dictionary API not configured');
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should return false and log an error if the external API call fails', async () => {
      process.env.DICTIONARY_API_URL = 'http://mockapi.com';
      process.env.DICTIONARY_API_KEY = 'mockkey';
      dictionaryService = new DictionaryService();

      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const exists = await dictionaryService.wordExists('failword');
      expect(exists).toBe(false);
      expect(logger.error).toHaveBeenCalledWith('Dictionary API error:', expect.any(Error));
    });
  });
});
