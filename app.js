function quizApp() {
    return {
        flagOpen: false,
        flagReason: 'inaccurate',

        settingsOpen: false,
        showImage: localStorage.getItem('quiz_showImage') !== 'false', 
        audioEnabled: localStorage.getItem('quiz_audioEnabled') !== 'false',
        questionType: localStorage.getItem('quiz_questionType') || 'multiple',

        audioPlaying: false,
        currentAudio: null,

        fontFamily: localStorage.getItem('quiz_fontFamily') || 'sans',
        fontSize: parseInt(localStorage.getItem('quiz_fontSize')) || 18,
        theme: localStorage.getItem('quiz_theme') || 'light',

        questionLang: "ka",
        nativeLang: "en",
        get translateUrl() {
            return `https://translate.google.com/?sl=${this.questionLang}&tl=${this.nativeLang}&text=${this.currentPage.question}&op=translate`
        },
        pages: [
            {
                imageUrl: "",
                audioUrl: "",
                question: "ახლა მე სამზარეულოში ვდგავარ და ფანჯარაში ვიყურები.",
                answer: "ვდგავარ",
                distractors: ["დგას", "ვიყურები", "ვზივარ"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "ჩემი და აივანზეა და მეკითხება: „როდის მოვლენ სტუმრები?“.",
                answer: "მოვლენ",
                distractors: ["მოვა", "მოვალთ", "მოდიან"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "მე ვპასუხობ, რომ ისინი გზაში არიან და ალბათ ხუთ წუთში მოვლენ.",
                answer: "მოვლენ",
                distractors: ["მოვალ", "მოვიდნენ", "მოდიოდნენ"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "შარშან, როცა დაბადების დღეს ავღნიშნავდი, ყველა სტუმარი ზუსტად დროსზე მოვიდა.",
                answer: "მოვიდა",
                distractors: ["მოვიდნენ", "მოდიოდა", "მოვედი"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "მაშინ ბევრი ხალხი მოდიოდა და სახლში დიდი ხმაური იყო.",
                answer: "მოდიოდა",
                distractors: ["მოდიოდნენ", "მოვედით", "მიდიოდა"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "სანამ ვსაუბრობდით, ჩემი ძმაც მოვიდა და საჩუქრები მოიტანა.",
                answer: "მოვიდა",
                distractors: ["მოხვედი", "მოიტანა", "მოვიდნენ"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "უცებ ეზოში მანქანა გაჩერდა.",
                answer: "გაჩერდა",
                distractors: ["გაჩერდნენ", "მივიდა", "დადგა"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "„შეხედე, ნინო მოდის!“ — დაიყვირა ჩემმა დამ.",
                answer: "მოდის",
                distractors: ["მოდიან", "მოვალ", "მიდის"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "მართლაც, ნინო ნელა მოდიოდა და დიდ ჩანთებს მოათრევდა.",
                answer: "მოდიოდა",
                distractors: ["მოდიოდი", "მოდიან", "მოვიდა"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "კარები გავაღე და მას ღიმილით ვუთხარი: „რა კარგია, რომ ასე ადრე მოხვედი!“.",
                answer: "მოხვედი",
                distractors: ["მოხვედით", "მოხვედი", "მოვიდა"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "ჩემი და აივანზეა და მეკითხება: „როდის ____ სტუმრები თბილისში?“",
                answer: "წავლენ",
                distractors: ["წავა", "მიდიან", "წავედით"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "მე ვპასუხობ, რომ ავტობუსი მალე მოვა და ისინი ალბათ ხუთ წუთში ____.",
                answer: "წავლენ",
                distractors: ["წავიდა", "მიდის", "წავალთ"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "შარშან, როცა მთაში ვმოგზაურობდით, ყველა დილის რვა საათზე ____.",
                answer: "წავიდა",
                distractors: ["წავიდნენ", "მიდიოდა", "წავლენ"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "მაშინ ყველა სტუდენტი სოფლიდან ერთად ____ და გზაში ბევრს ვმღეროდით.",
                answer: "მიდიოდა",
                distractors: ["მიდიოდნენ", "წავიდა", "წავლენ"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "სანამ მზე ამოვიდოდა, ჩემი ძმაც ____ სადგურში.",
                answer: "წავიდა",
                distractors: ["მიდის", "წავიდნენ", "წავა"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "„შეხედე, ნინო უკვე ____!“ — დაიყვირა ჩემმა დამ.",
                answer: "მიდის",
                distractors: ["წავიდა", "მიდიოდა", "წავა"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "მართლაც, ნინო ნელა ____ ჭიშკრისკენ და დიდ ჩანთებს მოათრევდა.",
                answer: "მიდიოდა",
                distractors: ["მიდის", "წავიდა", "წავიდნენ"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "კარები გავაღე და მას დავუძახე: „გაჩერდი, შენ რატომ ასე ადრე ____?“",
                answer: "წახვედი",
                distractors: ["წავიდა", "მიდიხარ", "წახვალ"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "ჩემი მეგობარი, ლუკა, პარიზში ____.",
                answer: "მიდის",
                distractors: ["მოდის", "მიდიოდა", "წავიდა"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "მე ვეუბნები: „იმედია, მალე უკან ____!“",
                answer: "მოხვალ",
                distractors: ["წახვალ", "მოვა", "მოხვედი"]
            },
            {
                imageUrl: "",
                audioUrl: " ",
                question: "ლუკა მპასუხობს, რომ ის აუცილებლად ____ ზაფხულში.",
                answer: "მოვა",
                distractors: ["მიდის", "მოვალ", "მოვიდა"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "როცა ლუკა ____, მე ცოტათი მოვიწყინე.",
                answer: "მიდიოდა",
                distractors: ["მოდიოდა", "მიდის", "წავიდა"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "გამახსენდა, როგორ ____ აქ ერთად შარშან.",
                answer: "მოვდიოდით",
                distractors: ["მივდიოდით", "მოვედით", "მოვდიოდი"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "მაშინ ბევრი ხალხი ____ და მიდიოდა, სადგური სავსე იყო.",
                answer: "მოდიოდა",
                distractors: ["მოდიან", "მოვიდა", "მიდიოდა"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "ჩემმა დამ მითხრა, რომ სტუმრები უკვე სახლში ____.",
                answer: "მოვიდნენ",
                distractors: ["მოვიდა", "მოდიან", "წავიდნენ"]
            },
            {
                imageUrl: "",
                audioUrl: "",
                question: "მეც სწრაფად ____ სადგურიდან, რადგან არ მინდოდა დაგვიანება.",
                answer: "წავედი",
                distractors: ["მივდიოდი", "წავიდა", "მოვედი"]
            }
        ],

        currentIndex: parseInt(localStorage.getItem('quiz_currentIndex')) || 0,
        get currentPage() {
            return this.pages[this.currentIndex];
        },
        get lastIndex() {
            return this.pages.length - 1;
        },
        get displayText() {
            // 1. Return original text if answer is missing
            if (!this.currentPage.answer) return this.currentPage.question;

            // 2. Escape special regex characters in the answer (like ?, ., *)
            const escapedAnswer = this.currentPage.answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // 3. Use a Regex that looks for the answer NOT preceded or followed by other letters
            // This works across different alphabets (Georgian, Cyrillic, etc.)
            // (?<!\p{L}) means "not preceded by a letter"
            // (?!\p{L}) means "not followed by a letter"
            const regex = new RegExp(`(?<!\\p{L})${escapedAnswer}(?!\\p{L})`, 'gui');

            // 4. Return the text with the styled placeholder
            return this.currentPage.question.replace(regex, `<span style="color: var(--primary); text-decoration:underline;text-decoration-thickness:3px">___</span>`);
        },


        init() {
            this.$watch('showImage', val => localStorage.setItem('quiz_showImage', val));
            this.$watch('audioEnabled', val => localStorage.setItem('quiz_audioEnabled', val));
            this.$watch('fontFamily', val => localStorage.setItem('quiz_fontFamily', val));
            this.$watch('fontSize', val => localStorage.setItem('quiz_fontSize', val));

            this.$watch('theme', (val) => {
                localStorage.setItem('quiz_theme', val);
                lucide.createIcons();
            });
            this.$watch('currentIndex', (val) => {
                this.pauseAudio();
                localStorage.setItem('quiz_currentIndex', val);
                this.setupQuestion();
            });
            this.$watch('questionType', (newVal) => {
                localStorage.setItem('quiz_questionType', val);
                this.setupQuestion();
            });
            this.setupQuestion();
            lucide.createIcons();
        },

        getFontFamily() {
            if (this.fontFamily === 'mono') return 'monospace';
            if (this.fontFamily === 'serif') return 'serif';
            return 'sans-serif';
        },

        nextQuestion() {
            if (this.currentIndex < this.lastIndex) this.currentIndex++;
        },
        prevQuestion() {
            if (this.currentIndex > 0) this.currentIndex--;
        },

        pauseAudio() {
            if (!this.currentAudio) return;
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.audioPlaying = false;
        },

        triggerAudio() {
            this.pauseAudio();
            //Play the audio if a URL exists
            if (this.currentPage?.audioUrl) {
                // Create new audio instance
                this.currentAudio = new Audio(this.currentPage.audioUrl);

                // Listen for when the audio finishes naturally
                this.currentAudio.onended = () => {
                    this.audioPlaying = false;
                };

                this.currentAudio.play()
                    .then(() => {
                        this.audioPlaying = true;
                    })
                    .catch(err => {
                        console.log("Playback error:", err);
                        this.audioPlaying = false;
                    });
            }
        },

        answered: false,
        diffResult: [],
        mcOptions: [],
        unscramblePool: [],
        unscrambleDropzone: [],
        userTextAnswer: '',

        setupQuestion() {
            this.answered = false;
            this.diffResult = [];
            const answer = this.currentPage.answer;

            // Setup MC
            let allOptions = [answer, ...this.currentPage.distractors];
            this.mcOptions = this.shuffleArray(allOptions).map(opt => ({text: opt, hidden: false}));

            // Setup Unscramble
            let chars = answer.split('');
            this.unscramblePool = this.shuffleArray(chars).map((char, index) => ({id: index, char: char, used: false}));
            this.unscrambleDropzone = [];

            // Setup Text
            this.userTextAnswer = '';
        },

        submitAnswer(submittedText) {
            this.diffResult = this.getDiff(submittedText, this.currentPage.answer);
            this.answered = true;
        },

        submitUnscramble() {
            const submittedText = this.unscrambleDropzone.map(t => t.char).join('');
            this.submitAnswer(submittedText);
        },

        triggerHint() {
            if (this.questionType === 'multiple') {
                // Hide one incorrect distractor
                let incorrectAvailable = this.mcOptions.filter(o => o.text !== this.currentPage.answer && !o.hidden);
                if (incorrectAvailable.length > 0) {
                    incorrectAvailable[0].hidden = true;
                }
            }
            else if (this.questionType === 'unscramble') {
                const answerChars = this.currentPage.answer.split('');

                // Find where the user made their first mistake
                let firstMistakeIdx = this.unscrambleDropzone.findIndex((tile, idx) => tile.char !== answerChars[idx]);

                if (firstMistakeIdx === -1) {
                    // No mistake yet, but incomplete
                    firstMistakeIdx = this.unscrambleDropzone.length;
                    if (firstMistakeIdx === answerChars.length) return; // already perfectly solved
                }

                // Remove incorrect tile and EVERYTHING after it
                const removedTiles = this.unscrambleDropzone.splice(firstMistakeIdx);
                removedTiles.forEach(tile => {
                    const poolTile = this.unscramblePool.find(p => p.id === tile.id);
                    if (poolTile) poolTile.used = false;
                });

                // Add the next correct tile from the pool
                const nextCorrectChar = answerChars[firstMistakeIdx];
                const correctPoolTile = this.unscramblePool.find(t => !t.used && t.char === nextCorrectChar);

                if (correctPoolTile) {
                    correctPoolTile.used = true;
                    this.unscrambleDropzone.push({...correctPoolTile});
                }
            }
            else if (this.questionType === 'text') {
                const answer = this.currentPage.answer;
                let current = this.userTextAnswer || "";
                let correctPrefix = "";

                // Find longest correct prefix
                for (let i = 0; i < current.length; i++) {
                    if (current[i] === answer[i]) {
                        correctPrefix += current[i];
                    } else {
                        break;
                    }
                }

                // Append next correct character
                if (correctPrefix.length < answer.length) {
                    this.userTextAnswer = correctPrefix + answer[correctPrefix.length];
                }
            }
        },

        tooManyErrors() {
            // Sum up deletions and insertions (non-matching characters)
            const errorCount = this.diffResult.reduce((count, chunk) => {
                return (chunk.type === 'deletion' || chunk.type === 'insertion')
                    ? count + 1
                    : count;
            }, 0);

            return errorCount > 3;
        },

        // --- UTILITIES ---
        shuffleArray(array) {
            let arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        },

        getDiff(input, expected) {
            const n = input.length;
            const m = expected.length;
            const dp = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));

            for (let i = 1; i <= n; i++) {
                for (let j = 1; j <= m; j++) {
                    if (input[i - 1] === expected[j - 1]) {
                        dp[i][j] = dp[i - 1][j - 1] + 1;
                    } else {
                        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    }
                }
            }

            let i = n, j = m;
            const result = [];

            while (i > 0 || j > 0) {
                if (i > 0 && j > 0 && input[i - 1] === expected[j - 1]) {
                    result.unshift({char: input[i - 1], type: 'match'});
                    i--; j--;
                } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
                    result.unshift({char: expected[j - 1], type: 'insertion'}); // missing from input
                    j--;
                } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
                    result.unshift({char: input[i - 1], type: 'deletion'}); // extra in input
                    i--;
                }
            }
            return result;
        },


        finishQuiz() {

        },


    }
}
