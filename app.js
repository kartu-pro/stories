function quizApp() {
    return {
        flagOpen: false,
        settingsOpen: false,
        showImage: true,
        audioEnabled: true,
        questionType: 'multiple',
        audioPlaying: false,
        currentAudio: null,
        fontFamily: 'sans',
        fontSize: 18,
        theme: 'light',
        
        pages: [
            {
                imageUrl: "https://placehold.co/600x400?text=Question+1",
                audioUrl: "https://placeholder.guru/api/audio",
                questionText: "Sample question content here...",
                answer: "answer1",
                distractors: ["distA", "distB"]
            }
        ],

        currentIndex: 0,
        answered: false,
        diffResult: [],
        mcOptions: [],
        unscramblePool: [],
        unscrambleDropzone: [],
        userTextAnswer: '',

        init() {
            this.$watch('theme', () => lucide.createIcons());
            this.$watch('currentIndex', () => this.setupQuestion());
            this.$watch('questionType', () => this.setupQuestion());
            this.setupQuestion();
            lucide.createIcons();
        },

        get currentPage() { return this.pages[this.currentIndex]; },
        get lastIndex() { return this.pages.length - 1; },

        setupQuestion() {
            this.answered = false;
            const answer = this.currentPage.answer;
            this.mcOptions = this.shuffleArray([answer, ...this.currentPage.distractors]).map(opt => ({text: opt, hidden: false}));
            this.unscramblePool = this.shuffleArray(answer.split('')).map((char, index) => ({id: index, char, used: false}));
            this.unscrambleDropzone = [];
            this.userTextAnswer = '';
        },

        submitAnswer(submittedText) {
            this.diffResult = this.getDiff(submittedText, this.currentPage.answer);
            this.answered = true;
        },

        getDiff(input, expected) {
            // Logic for calculating differences (same as original)
            const n = input.length, m = expected.length;
            const dp = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));
            for (let i = 1; i <= n; i++) {
                for (let j = 1; j <= m; j++) {
                    dp[i][j] = input[i - 1] === expected[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
            let i = n, j = m, result = [];
            while (i > 0 || j > 0) {
                if (i > 0 && j > 0 && input[i - 1] === expected[j - 1]) {
                    result.unshift({char: input[i - 1], type: 'match'}); i--; j--;
                } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
                    result.unshift({char: expected[j - 1], type: 'insertion'}); j--;
                } else {
                    result.unshift({char: input[i - 1], type: 'deletion'}); i--;
                }
            }
            return result;
        },

        shuffleArray(array) {
            return array.sort(() => Math.random() - 0.5);
        },

        getFontFamily() {
            return this.fontFamily === 'mono' ? 'monospace' : this.fontFamily === 'serif' ? 'serif' : 'sans-serif';
        },

        nextQuestion() { if (this.currentIndex < this.lastIndex) this.currentIndex++; },
        prevQuestion() { if (this.currentIndex > 0) this.currentIndex--; }
    }
}
