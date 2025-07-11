export type ConjunctionEntry = {
  Term: string;
  Definition: string;
}


export type Words = {
  words: string[];
}

export type Answer = string;

export type Question = {
  Header: string;
  Options: Answer[];
  AnswerIndexes: number[];
}

export type RandomCardItem = {
  Text: string;
  Image: File | null | undefined;
}

export type SpellingItem = {
  Word: string,
  Image: File | null,
}

export type ResetPasswordData = {
  email: string;
  resetCode: string;
  password: string;
}
export type Course = {
  courseId: string;
  courseName: string;
  levelId: string;
  levelName: string;
  dataText?: string;
  thumbnail?: string;
  images?: string[];
}
export type Minigame = {
  minigameId: string;
  minigameName: string;
  teacherId: string;
  teacherName: string;
  thumbnailImage: string;
  duration: number;
  participantsCount: number | null;
  ratingScore: number | null;
  templateId: string;
  templateName: string;
  courseId: string;
};
export type Conjunction = {
  MinigameName: string,
  ImageFile: File | null,
  TeacherId: string,
  Duration: number,
  TemplateId: string,
  CourseId: string,
  GameData: ConjunctionEntry[];
}
export type Anagram = {
  MinigameName: string;
  ImageFile: File | null;
  TeacherId: string;
  Duration: number;
  TemplateId: string;
  CourseId: string;
  GameData: Words[];
}
export type QuizData = {
  MinigameName: string;
  ImageFile: File | null;
  TeacherId: string;
  Duration: number;
  TemplateId: string;
  CourseId: string;
  GameData: Question[];
}
export type UpdateQuizData = {
  MinigameId: string;
  MinigameName: string;
  ImageFile?: File | null; // File ảnh mới (nếu có)
  ImageUrl?: string | null; // URL ảnh cũ (nếu không có file mới)
  Duration: number;
  TemplateId: string;
  TeacherId: string;
  GameData: Question[];
}
// Type cho UpdateConjunctionData
export type UpdateConjunctionData = {
  MinigameId: string;
  MinigameName: string;
  ImageFile?: File | null; // File ảnh mới (nếu có)
  ImageUrl?: string | null; // URL ảnh cũ (nếu không có file mới)
  Duration: number;
  TemplateId: string;
  TeacherId: string;
  GameData: Array<{
    Term: string;
    Definition: string;
  }>;
}
export type UpdateAnagramData = {
  MinigameId: string;
  MinigameName: string;
  ImageFile?: File;
  ImageUrl?: string | null; // URL ảnh cũ (nếu không có file mới)
  Duration: number;
  TemplateId: string;
  TeacherId: string;
  GameData: Words[]
};
export type FetchTeacherMinigamesParams = {
  teacherId: string;
  minigameName?: string;
  templateId?: string;
  pageNum?: number;
  pageSize?: number;
}
export type RandomCardData = {
  MinigameName: string,
  ImageFile: File,
  TeacherId: string,
  Duration: number,
  TemplateId: string,
  CourseId: string,
  GameData: RandomCardItem[],
}
export type UpdateRandomCardData = {
  MinigameId: string;
  MinigameName: string;
  ImageFile?: File;
  ImageUrl?: string | null; // URL ảnh cũ (nếu không có file mới)
  Duration: number;
  TemplateId: string;
  TeacherId: string;
  GameData: {
    Text: string,
    Image?: File | null,
    ImageUrl: string,
  }[]
}
export type SpellingData = {
  MinigameName: string;
  ImageFile: File | null;
  TeacherId: string;
  Duration: string;
  TemplateId: string;
  CourseId: string;
  GameData: SpellingItem[];
}
export type UpdateSpellingData = {
  MinigameId: string;
  MinigameName: string;
  ImageFile: File | null;
  ImageUrl?: string | null;
  Duration: number;
  TemplateId: string;
  TeacherId: string;
  GameData: {
    Word: string,
    ImageUrl: string,
    Image?: File | null,
  }[];
}
export type Accomplishment = {
  MinigameId: string;
  Percent: number;
  DurationInSecond: number;
  TakenDate: Date;
}
/** Kiểu dữ liệu trả về từ API   */
export type AccomplishmentData = {
  studentId: string;
  minigameId: string;
  minigameName: string;
  thumbnailImage: string;
  score: number;
  templateId: string;
  templateName: string;
  courseId: string;
  courseName: string;
  takenDate: string; // ISO string
}
export type Flashcard = {
  id: number;
  front: string;
  back: string;
}
export type FlashCardData = {
  MinigameName: string;
  ImageFile: File | null;
  TeacherId: string;
  Duration: number;
  TemplateId: string;
  CourseId: string;
  GameData: {
    Front: string,
    Back: string,
  }[];
}
export type UpdateFlashCard = {
  MinigameId: string;
  MinigameName: string;
  ImageFile: File | null;
  ImageUrl?: string | null;
  Duration: number;
  TemplateId: string;
  TeacherId: string;
  GameData: {
    Front: string,
    Back: string,
  }[];
}
export type rateMinigameData = {
  StudentId: string,
  MinigameId: string,
  Score: number,
  Comment: string,
}
export type Completion = {
  Sentence: string;
  Options: string[];
  AnswerIndexes: number[];
}
export type CompletionData = {
  MinigameName: string;
  ImageFile: File | null;
  TeacherId: string;
  Duration: number;
  TemplateId: string;
  CourseId: string;
  GameData: Completion[];
}
export type UpdateCompletionData = {
  MinigameId: string;
  MinigameName: string;
  ImageFile: File | null;
  ImageUrl?: string | null;
  Duration: number;
  TemplateId: string;
  TeacherId: string;
  GameData: Completion[];
}
export type PairingData = {
  MinigameName: string;
  ImageFile: File | null;
  TeacherId: string;
  Duration: number;
  TemplateId: string;
  CourseId: string;
  GameData: Words[];
}
export type UpdatePairingData = {
  MinigameId: string;
  MinigameName: string;
  ImageFile: File | null;
  ImageUrl?: string | null;
  Duration: number;
  TemplateId: string;
  TeacherId: string;
  GameData: Words[];
}
export type RestorationData = {
  MinigameName: string;
  ImageFile: File | null;
  TeacherId: string;
  Duration: number;
  TemplateId: string;
  CourseId: string;
  GameData: Words[];
}
export type UpdateRestorationData = {
  MinigameId: string;
  MinigameName: string;
  ImageFile: File | null;
  ImageUrl?: string | null;
  Duration: number;
  TeacherId: string;
  GameData: Words[];
}
export type TrueFalse = {
  MinigameName: string;
  ImageFile: File | null;
  TeacherId: string;
  Duration: number;
  CourseId: string;
  GameData: {
    Statement: string[],
    Answer: boolean,
  }[]
}
export type UpdateTrueFalseData = {
  MinigameId: string;
  MinigameName: string;
  ImageFile: File | null;
  ImageUrl?: string | null;
  Duration: number;
  TeacherId: string;
  GameData: {
    Statement: string[],
    Answer: boolean,
  }[]
}
export type SupscriptionExtention ={
  userId: string;
  tierId: string;
  transactionId: string;
  days: number;
}
export type UpgradeTierData = {
  userId: string;
  orderCode: number;
  isTeacher: boolean;
  tierId: string;
}
export type FindWordData = {
  MinigameName: string;
  ImageFile: File | null;
  TeacherId: string;
  Duration: number;
  CourseId: string;
  GameData: {
    Hint: string,
    Words: string[],
    DimensionSize: number,
  }[]
}
export type UpdateFindWordData = {
  MinigameId: string;
  MinigameName: string;
  ImageFile: File | null;
  ImageUrl?: string | null;
  Duration: number;
  TeacherId: string;
  GameData: {
    Hint: string,
    Words: string[],
    DimensionSize: number,
  }[]
}
export type CrosswordData = {
  MinigameName: string;
  ImageFile: File | null;
  TeacherId: string;
  Duration: number;
  CourseId: string;
  GameData: {
    Words: string[],
    Clues: string[],
    DimensionSize: number,
  }[]
}
export type UpdateCrosswordData = {
  MinigameId: string;
  MinigameName: string;
  ImageFile: File | null;
  ImageUrl?: string | null;
  Duration: number;
  TeacherId: string;
  GameData: {
    Words: string[],
    Clues: string[],
    DimensionSize: number,
  }[]
}