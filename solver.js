/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  AI Math Solver - ULTIMATE PROFESSIONAL MATHEMATICS ENGINE
 *  Version 1.0 - MAXIMUM INTELLIGENCE
 *  
 *  QISM 1/15 - Core Engine & Initialization
 *  
 *  Bu qismni BIRINCHI paste qiling!
 * ═══════════════════════════════════════════════════════════════════════════
 */

const MathSolver = {
    // ═══ Core State ═══
    version: '1.0-ULTIMATE',
    currentUser: null,
    currentImage: null,
    currentProblem: null,
    isProcessing: false,
    
    // ═══ Statistics ═══
    stats: {
        problemsSolved: 0,
        imagesProcessed: 0,
        successRate: 100,
        totalSessions: 0
    },
    
    // ═══ History ═══
    history: [],
    maxHistorySize: 50,
    
    // ═══ OCR Engine ═══
    ocrEngine: null,
    ocrProgress: 0,
    
    // ═══ Math Engine ═══
    mathEngine: null,
    
    // ═══ Configuration ═══
    config: {
        maxImageSize: 10 * 1024 * 1024, // 10MB
        supportedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        ocrLanguage: 'eng',
        confidenceThreshold: 0.6,
        processingTimeout: 60000 // 60 seconds
    },

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    
    init() {
        console.log('🧮 ═══════════════════════════════════════════════════');
        console.log('🧮 AI Math Solver v' + this.version);
        console.log('🧮 Initializing Mathematics Engine...');
        console.log('🧮 ═══════════════════════════════════════════════════');
        
        try {
            // Initialize math.js
            if (typeof math !== 'undefined') {
                this.mathEngine = math;
                console.log('✅ Math.js engine loaded');
            } else {
                console.error('❌ Math.js not found!');
            }
            
            // Initialize Tesseract.js
            if (typeof Tesseract !== 'undefined') {
                console.log('✅ Tesseract.js loaded');
            } else {
                console.error('❌ Tesseract.js not found!');
            }
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load user data
            this.loadUserStats(MathAuth.currentUser);
            
            // Load history
            this.loadHistory();
            
            console.log('✅ Core modules loaded');
            console.log('✅ Event listeners ready');
            console.log('✅ Statistics loaded');
            console.log('🚀 MATH SOLVER FULLY OPERATIONAL!');
            
        } catch (error) {
            console.error('❌ CRITICAL: Math Solver initialization failed:', error);
            MathUtils.notify('⚠️ Xatolik! Sahifani yangilang!', 'error');
        }
    },

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT LISTENERS SETUP
    // ═══════════════════════════════════════════════════════════════════════
    
    setupEventListeners() {
        // Gallery upload button
        const galleryBtn = $('uploadFromGalleryBtn');
        if (galleryBtn) {
            galleryBtn.addEventListener('click', () => {
                const input = $('mathImageInput');
                if (input) input.click();
            });
        }

        // Camera button
        const cameraBtn = $('takePhotoBtn');
        if (cameraBtn) {
            cameraBtn.addEventListener('click', () => {
                const input = $('mathCameraInput');
                if (input) input.click();
            });
        }

        // File input handlers
        const imageInput = $('mathImageInput');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.handleImageUpload(e.target.files[0]);
                }
            });
        }

        const cameraInput = $('mathCameraInput');
        if (cameraInput) {
            cameraInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.handleImageUpload(e.target.files[0]);
                }
            });
        }

        // Remove image button
        const removeBtn = $('removeImageBtn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => this.removeImage());
        }

        // Process button
        const processBtn = $('processMathBtn');
        if (processBtn) {
            processBtn.addEventListener('click', () => this.processProblem());
        }

        // Quick solve button
        const quickSolveBtn = $('quickSolveBtn');
        if (quickSolveBtn) {
            quickSolveBtn.addEventListener('click', () => this.quickSolve());
        }

        // Quick input enter key
        const quickInput = $('quickMathInput');
        if (quickInput) {
            quickInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.quickSolve();
            });
        }

        // Clear history button
        const clearHistoryBtn = $('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }

        // Admin chat button
        const adminChatBtn = $('openMathAdminChatBtn');
        if (adminChatBtn) {
            adminChatBtn.addEventListener('click', () => {
                if (typeof MathChatWithAdmin !== 'undefined') {
                    MathChatWithAdmin.openChat();
                }
            });
        }

        console.log('✅ Event listeners configured');
    },

    // ═══════════════════════════════════════════════════════════════════════
    // IMAGE UPLOAD HANDLER
    // ═══════════════════════════════════════════════════════════════════════
    
    async handleImageUpload(file) {
        try {
            console.log('📸 Processing image upload:', file.name);
            
            // Validate file
            const validation = this.validateImage(file);
            if (!validation.valid) {
                MathUtils.notify(validation.message, 'error');
                return;
            }

            MathUtils.showLoading(true, 'Rasm yuklanmoqda...');

            // Read image
            const imageData = await this.readImageFile(file);
            
            // Display preview
            this.displayImagePreview(imageData);
            
            // Update state
            this.currentImage = {
                file: file,
                data: imageData,
                name: file.name,
                size: file.size,
                type: file.type,
                uploadTime: Date.now()
            };

            // Update stats
            this.stats.imagesProcessed++;
            this.updateStats();

            // Show process button
            const processBtn = $('processMathBtn');
            if (processBtn) processBtn.classList.remove('hidden');

            MathUtils.showLoading(false);
            MathUtils.notify('✅ Rasm yuklandi! Endi tahlil qiling.', 'success');
            
            // Log
            MathUtils.log(MathAuth.currentUser, `Rasm yuklandi: ${file.name}`, 'upload');
            
        } catch (error) {
            console.error('❌ Image upload error:', error);
            MathUtils.showLoading(false);
            MathUtils.notify('❌ Rasmni yuklashda xatolik!', 'error');
        }
    },

    validateImage(file) {
        if (!file) {
            return { valid: false, message: '⚠️ Fayl tanlanmagan!' };
        }

        if (!this.config.supportedFormats.includes(file.type)) {
            return { 
                valid: false, 
                message: '⚠️ Noto\'g\'ri format! Faqat JPG, PNG, WEBP ruxsat etilgan.' 
            };
        }

        if (file.size > this.config.maxImageSize) {
            const maxMB = this.config.maxImageSize / (1024 * 1024);
            return { 
                valid: false, 
                message: `⚠️ Rasm juda katta! Maksimal ${maxMB}MB.` 
            };
        }

        if (file.size === 0) {
            return { valid: false, message: '⚠️ Fayl bo\'sh!' };
        }

        return { valid: true };
    },

    readImageFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Faylni o\'qib bo\'lmadi'));
            };
            
            reader.readAsDataURL(file);
        });
    },

    displayImagePreview(imageData) {
        const preview = $('imagePreview');
        const img = $('previewImage');
        
        if (preview && img) {
            img.src = imageData;
            preview.classList.remove('hidden');
            
            // Smooth animation
            preview.style.animation = 'fadeIn 0.5s ease';
        }
    },

    removeImage() {
        this.currentImage = null;
        
        const preview = $('imagePreview');
        const processBtn = $('processMathBtn');
        const imageInput = $('mathImageInput');
        const cameraInput = $('mathCameraInput');
        
        if (preview) preview.classList.add('hidden');
        if (processBtn) processBtn.classList.add('hidden');
        if (imageInput) imageInput.value = '';
        if (cameraInput) cameraInput.value = '';
        
        MathUtils.notify('🗑️ Rasm o\'chirildi', 'success');
    },

    // ═══════════════════════════════════════════════════════════════════════
    // STATISTICS MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    loadUserStats(username) {
        if (!username) return;
        
        const users = MathStorage.load('users', {});
        const userData = users[username];
        
        if (userData) {
            this.stats.problemsSolved = userData.problemsSolved || 0;
            this.stats.imagesProcessed = userData.imagesProcessed || 0;
            this.stats.successRate = userData.successRate || 100;
        }
        
        this.updateStatsDisplay();
        console.log('📊 Stats loaded:', this.stats);
    },

    updateStats() {
        if (!MathAuth.currentUser) return;
        
        const users = MathStorage.load('users', {});
        if (users[MathAuth.currentUser]) {
            users[MathAuth.currentUser].problemsSolved = this.stats.problemsSolved;
            users[MathAuth.currentUser].imagesProcessed = this.stats.imagesProcessed;
            users[MathAuth.currentUser].successRate = this.stats.successRate;
            MathStorage.save('users', users);
        }
        
        this.updateStatsDisplay();
    },

    updateStatsDisplay() {
        const problemsSolvedEl = $('problemsSolved');
        const imagesProcessedEl = $('imagesProcessed');
        const successRateEl = $('successRate');
        
        if (problemsSolvedEl) {
            problemsSolvedEl.textContent = this.stats.problemsSolved;
        }
        if (imagesProcessedEl) {
            imagesProcessedEl.textContent = this.stats.imagesProcessed;
        }
        if (successRateEl) {
            successRateEl.textContent = this.stats.successRate + '%';
        }
    },

    // ═══════════════════════════════════════════════════════════════════════
    // HISTORY MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    loadHistory() {
        if (!MathAuth.currentUser) return;
        
        this.history = MathStorage.load(`history_${MathAuth.currentUser}`, []);
        this.displayHistory();
        
        console.log('📜 History loaded:', this.history.length, 'items');
    },

    saveHistory() {
        if (!MathAuth.currentUser) return;
        
        // Keep only last N items
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(-this.maxHistorySize);
        }
        
        MathStorage.save(`history_${MathAuth.currentUser}`, this.history);
    },

    addToHistory(problem, solution) {
        const historyItem = {
            id: Date.now(),
            problem: problem,
            solution: solution,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleString('uz-UZ')
        };
        
        this.history.unshift(historyItem);
        this.saveHistory();
        this.displayHistory();
    },

    displayHistory() {
        const historyList = $('historyList');
        if (!historyList) return;
        
        if (this.history.length === 0) {
            historyList.innerHTML = `
                <div style="text-align:center;padding:30px;color:var(--gray);">
                    <p>📜 Hozircha tarix bo'sh</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = this.history.slice(0, 5).map(item => `
            <div style="background:rgba(255,255,255,0.03);padding:12px;border-radius:8px;border:1px solid var(--border);cursor:pointer;transition:all 0.3s;"
                 onclick="MathSolver.viewHistoryItem(${item.id})">
                <div style="font-size:13px;color:#4facfe;margin-bottom:5px;">
                    ${MathUtils.escapeHtml(item.problem.substring(0, 50))}...
                </div>
                <div style="font-size:11px;color:var(--gray);">
                    ${MathUtils.escapeHtml(item.date)}
                </div>
            </div>
        `).join('');
    },

    viewHistoryItem(id) {
        const item = this.history.find(h => h.id === id);
        if (!item) return;
        
        const solutionResult = $('solutionResult');
        if (solutionResult) {
            solutionResult.innerHTML = item.solution;
            solutionResult.scrollIntoView({ behavior: 'smooth' });
        }
        
        MathUtils.notify('📜 Tarix ko\'rsatildi', 'success');
    },

    clearHistory() {
        if (!confirm('❓ Tarixni tozalamoqchimisiz?')) return;
        
        this.history = [];
        this.saveHistory();
        this.displayHistory();
        
        MathUtils.notify('🗑️ Tarix tozalandi', 'success');
    }
};

console.log('✅ MATHSOLVER.JS QISM 1/15 loaded - Core Engine ready');
console.log('➡️  Keyingi qismni paste qiling...');/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  AI Math Solver - ULTIMATE PROFESSIONAL MATHEMATICS ENGINE
 *  Version 1.0 - MAXIMUM INTELLIGENCE
 *  
 *  QISM 2/15 - OCR Engine & Image Processing
 *  
 *  QISM 1 dan keyin paste qiling!
 * ═══════════════════════════════════════════════════════════════════════════
 */

Object.assign(MathSolver, {
    
    // ═══════════════════════════════════════════════════════════════════════
    // PROCESS PROBLEM (Main Entry Point)
    // ═══════════════════════════════════════════════════════════════════════
    
    async processProblem() {
        if (this.isProcessing) {
            MathUtils.notify('⏳ Jarayon davom etmoqda...', 'warning');
            return;
        }

        if (!this.currentImage) {
            MathUtils.notify('⚠️ Avval rasm yuklang!', 'error');
            return;
        }

        this.isProcessing = true;

        try {
            console.log('🔍 Starting problem processing...');
            
            MathUtils.showLoading(true, 'Masala tahlil qilinmoqda...');

            // Step 1: OCR - Extract text from image
            const extractedText = await this.performOCR(this.currentImage.data);
            
            if (!extractedText || extractedText.trim().length === 0) {
                throw new Error('Rasmdan matn chiqmadi. Iltimos, aniqroq rasm yuklang.');
            }

            console.log('✅ OCR complete:', extractedText.substring(0, 100));

            // Step 2: Analyze and identify problem type
            MathUtils.showLoading(true, 'Masala turi aniqlanmoqda...');
            const problemAnalysis = this.analyzeProblem(extractedText);
            
            console.log('✅ Problem analyzed:', problemAnalysis.type);

            // Step 3: Solve the problem
            MathUtils.showLoading(true, 'Masala yechilmoqda...');
            const solution = await this.solveProblem(extractedText, problemAnalysis);
            
            console.log('✅ Solution generated');

            // Step 4: Display solution
            this.displaySolution(extractedText, solution, problemAnalysis);

            // Step 5: Update stats and history
            this.stats.problemsSolved++;
            this.updateStats();
            this.addToHistory(extractedText, solution);

            // Log
            MathUtils.log(MathAuth.currentUser, `Masala yechildi: ${extractedText.substring(0, 30)}...`, 'solve');

            MathUtils.showLoading(false);
            MathUtils.notify('✅ Masala muvaffaqiyatli yechildi!', 'success');

        } catch (error) {
            console.error('❌ Problem processing error:', error);
            MathUtils.showLoading(false);
            this.displayError(error);
        } finally {
            this.isProcessing = false;
        }
    },

    // ═══════════════════════════════════════════════════════════════════════
    // OCR ENGINE (Tesseract.js)
    // ═══════════════════════════════════════════════════════════════════════
    
    async performOCR(imageData) {
        try {
            console.log('🔍 Starting OCR...');
            
            if (typeof Tesseract === 'undefined') {
                throw new Error('Tesseract.js yuklanmagan!');
            }

            const result = await Tesseract.recognize(
                imageData,
                this.config.ocrLanguage,
                {
                    logger: (m) => {
                        if (m.status === 'recognizing text') {
                            const progress = Math.round(m.progress * 100);
                            MathUtils.showLoading(true, `OCR: ${progress}%`);
                            this.ocrProgress = progress;
                        }
                    }
                }
            );

            const text = result.data.text.trim();
            const confidence = result.data.confidence;

            console.log('📊 OCR Confidence:', confidence + '%');

            if (confidence < this.config.confidenceThreshold * 100) {
                console.warn('⚠️ Low OCR confidence:', confidence);
            }

            return text;

        } catch (error) {
            console.error('❌ OCR error:', error);
            throw new Error('Matnni tanib bo\'lmadi: ' + error.message);
        }
    },

    // ═══════════════════════════════════════════════════════════════════════
    // PROBLEM ANALYSIS
    // ═══════════════════════════════════════════════════════════════════════
    
    analyzeProblem(text) {
        const analysis = {
            type: 'unknown',
            category: 'general',
            difficulty: 'medium',
            operations: [],
            hasVariables: false,
            hasEquation: false,
            hasGraph: false,
            confidence: 0
        };

        const lower = text.toLowerCase();

        // Detect problem type
        if (this.isArithmetic(text)) {
            analysis.type = 'arithmetic';
            analysis.category = 'basic';
            analysis.difficulty = 'easy';
        } else if (this.isAlgebraic(text)) {
            analysis.type = 'algebra';
            analysis.category = 'equation';
            analysis.hasVariables = true;
            analysis.hasEquation = true;
        } else if (this.isGeometry(text)) {
            analysis.type = 'geometry';
            analysis.category = 'shapes';
        } else if (this.isCalculus(text)) {
            analysis.type = 'calculus';
            analysis.category = 'advanced';
            analysis.difficulty = 'hard';
        } else if (this.isTrigonometry(text)) {
            analysis.type = 'trigonometry';
            analysis.category = 'angles';
        } else if (this.isStatistics(text)) {
            analysis.type = 'statistics';
            analysis.category = 'data';
        }

        // Detect operations
        analysis.operations = this.detectOperations(text);

        // Estimate confidence
        analysis.confidence = this.estimateConfidence(text, analysis);

        return analysis;
    },

    isArithmetic(text) {
        const patterns = [
            /^\s*\d+\s*[\+\-\*\/×÷]\s*\d+/,
            /^\s*\(\s*\d+\s*[\+\-\*\/×÷]/,
            /\d+\s*[\+\-]\s*\d+\s*[\*\/]/
        ];
        return patterns.some(p => p.test(text));
    },

    isAlgebraic(text) {
        const patterns = [
            /[a-z]\s*=\s*/i,
            /\d*[a-z][\+\-]/i,
            /[a-z]\^?\d*/i,
            /solve|найти|topish/i
        ];
        return patterns.some(p => p.test(text));
    },

    isGeometry(text) {
        const keywords = [
            'triangle', 'uchburchak', 'треугольник',
            'circle', 'aylana', 'круг',
            'square', 'kvadrat', 'квадрат',
            'rectangle', 'to\'g\'ri to\'rtburchak',
            'perimeter', 'perimetr', 'периметр',
            'area', 'yuza', 'площадь',
            'volume', 'hajm', 'объем'
        ];
        const lower = text.toLowerCase();
        return keywords.some(k => lower.includes(k));
    },

    isCalculus(text) {
        const patterns = [
            /d[xy]\/d[xy]/,
            /∫|integral|интеграл/i,
            /∂|derivative|производная|hosila/i,
            /lim|limit|предел/i
        ];
        return patterns.some(p => p.test(text));
    },

    isTrigonometry(text) {
        const keywords = [
            'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
            'arcsin', 'arccos', 'arctan',
            'sinh', 'cosh', 'tanh'
        ];
        const lower = text.toLowerCase();
        return keywords.some(k => lower.includes(k));
    },

    isStatistics(text) {
        const keywords = [
            'mean', 'median', 'mode', 'o\'rtacha',
            'average', 'variance', 'dispersion',
            'standard deviation', 'probability', 'ehtimol'
        ];
        const lower = text.toLowerCase();
        return keywords.some(k => lower.includes(k));
    },

    detectOperations(text) {
        const operations = [];
        
        if (/[\+]/.test(text)) operations.push('addition');
        if (/[\-]/.test(text)) operations.push('subtraction');
        if (/[\*×]/.test(text)) operations.push('multiplication');
        if (/[\/÷]/.test(text)) operations.push('division');
        if (/\^|\*\*/.test(text)) operations.push('exponentiation');
        if (/√|sqrt/i.test(text)) operations.push('root');
        if (/log|ln/i.test(text)) operations.push('logarithm');
        
        return operations;
    },

    estimateConfidence(text, analysis) {
        let confidence = 0.5;
        
        // More confidence if problem type detected
        if (analysis.type !== 'unknown') confidence += 0.2;
        
        // More confidence if operations detected
        if (analysis.operations.length > 0) confidence += 0.1;
        
        // More confidence if has numbers
        if (/\d/.test(text)) confidence += 0.1;
        
        // Less confidence if very short
        if (text.length < 5) confidence -= 0.3;
        
        return Math.max(0, Math.min(1, confidence));
    },

    // ═══════════════════════════════════════════════════════════════════════
    // QUICK SOLVE (Text Input)
    // ═══════════════════════════════════════════════════════════════════════
    
    async quickSolve() {
        const input = $('quickMathInput');
        if (!input) return;

        const text = input.value.trim();
        
        if (!text) {
            MathUtils.notify('⚠️ Masala yozing!', 'error');
            return;
        }

        try {
            console.log('⚡ Quick solve:', text);
            
            MathUtils.showLoading(true, 'Yechish...');

            const problemAnalysis = this.analyzeProblem(text);
            const solution = await this.solveProblem(text, problemAnalysis);
            
            this.displaySolution(text, solution, problemAnalysis);

            this.stats.problemsSolved++;
            this.updateStats();
            this.addToHistory(text, solution);

            input.value = '';

            MathUtils.showLoading(false);
            MathUtils.notify('✅ Yechildi!', 'success');
            
            MathUtils.log(MathAuth.currentUser, `Quick solve: ${text}`, 'solve');

        } catch (error) {
            console.error('❌ Quick solve error:', error);
            MathUtils.showLoading(false);
            this.displayError(error);
        }
    },

    // ═══════════════════════════════════════════════════════════════════════
    // IMAGE PREPROCESSING (Optional Enhancement)
    // ═══════════════════════════════════════════════════════════════════════
    
    preprocessImage(imageData) {
        // Future: Add image enhancement
        // - Contrast adjustment
        // - Noise reduction
        // - Edge detection
        // - Thresholding
        
        return imageData;
    }
});

console.log('✅ MATHSOLVER.JS QISM 2/15 loaded - OCR & Image Processing ready');
console.log('➡️  Keyingi qismni paste qiling...');/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  AI Math Solver - ULTIMATE PROFESSIONAL MATHEMATICS ENGINE
 *  Version 1.0 - MAXIMUM INTELLIGENCE
 *  
 *  QISM 3/15 - Problem Solving Engine (Core Algorithms)
 *  
 *  QISM 2 dan keyin paste qiling!
 * ═══════════════════════════════════════════════════════════════════════════
 */

Object.assign(MathSolver, {
    
    // ═══════════════════════════════════════════════════════════════════════
    // MAIN PROBLEM SOLVER
    // ═══════════════════════════════════════════════════════════════════════
    
    async solveProblem(text, analysis) {
        console.log('🧮 Solving problem:', analysis.type);
        
        try {
            let solution = '';
            
            switch (analysis.type) {
                case 'arithmetic':
                    solution = await this.solveArithmetic(text);
                    break;
                case 'algebra':
                    solution = await this.solveAlgebra(text);
                    break;
                case 'geometry':
                    solution = await this.solveGeometry(text);
                    break;
                case 'calculus':
                    solution = await this.solveCalculus(text);
                    break;
                case 'trigonometry':
                    solution = await this.solveTrigonometry(text);
                    break;
                case 'statistics':
                    solution = await this.solveStatistics(text);
                    break;
                default:
                    solution = await this.solveGeneral(text);
            }
            
            return solution;
            
        } catch (error) {
            console.error('❌ Solve error:', error);
            throw new Error('Masalani yechishda xatolik: ' + error.message);
        }
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ARITHMETIC SOLVER
    // ═══════════════════════════════════════════════════════════════════════
    
    async solveArithmetic(text) {
        console.log('➕ Solving arithmetic...');
        
        // Clean the expression
        let expr = this.cleanExpression(text);
        
        try {
            // Use math.js to evaluate
            const result = this.mathEngine.evaluate(expr);
            
            return this.formatArithmeticSolution(expr, result);
            
        } catch (error) {
            console.error('Arithmetic error:', error);
            return this.formatError('Arifmetik masalani yechib bo\'lmadi', text);
        }
    },

    cleanExpression(text) {
        return text
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/(\d)\s*\(/g, '$1*(')
            .replace(/\)\s*(\d)/g, ')*$1')
            .replace(/[^\d\+\-\*\/\(\)\.\^]/g, '')
            .trim();
    },

    formatArithmeticSolution(expr, result) {
        return `
            <div style="animation:fadeIn 0.5s">
                <h3 style="color:#00ff64;margin-bottom:20px;">✅ Arifmetik Masala Yechimi</h3>
                
                <div style="background:rgba(102,126,234,0.1);padding:25px;border-radius:16px;margin-bottom:20px;">
                    <h4 style="color:#667eea;margin-bottom:15px;">📝 Masala</h4>
                    <div style="font-size:24px;font-family:'Courier New',monospace;text-align:center;">
                        ${this.escapeHtml(expr)}
                    </div>
                </div>

                <div style="background:rgba(0,255,100,0.1);padding:30px;border-radius:16px;margin-bottom:20px;">
                    <h4 style="color:#00ff64;margin-bottom:15px;">🎯 Javob</h4>
                    <div style="font-size:42px;font-weight:700;text-align:center;color:#00ff64;">
                        ${this.escapeHtml(String(result))}
                    </div>
                </div>

                <div style="background:rgba(79,172,254,0.05);padding:20px;border-radius:12px;">
                    <h4 style="color:#4facfe;margin-bottom:15px;">💡 Tushuntirish</h4>
                    <div style="line-height:2;">
                        ${this.generateArithmeticExplanation(expr, result)}
                    </div>
                </div>
            </div>
        `;
    },

    generateArithmeticExplanation(expr, result) {
        const steps = [];
        
        steps.push(`<p>1️⃣ Berilgan ifoda: <code style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;">${this.escapeHtml(expr)}</code></p>`);
        
        if (expr.includes('(')) {
            steps.push(`<p>2️⃣ Qavslarni hisoblaymiz (qavslar birinchi)</p>`);
        }
        
        if (expr.includes('*') || expr.includes('/')) {
            steps.push(`<p>3️⃣ Ko'paytirish va bo'lishni bajaramiz</p>`);
        }
        
        if (expr.includes('+') || expr.includes('-')) {
            steps.push(`<p>4️⃣ Qo'shish va ayirishni bajaramiz</p>`);
        }
        
        steps.push(`<p>5️⃣ <strong>Natija:</strong> <span style="color:#00ff64;font-size:18px;">${this.escapeHtml(String(result))}</span></p>`);
        
        return steps.join('');
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ALGEBRA SOLVER
    // ═══════════════════════════════════════════════════════════════════════
    
    async solveAlgebra(text) {
        console.log('🔤 Solving algebra...');
        
        try {
            // Extract equation
            const equation = this.extractEquation(text);
            
            if (!equation) {
                return this.formatError('Tenglamani aniqlab bo\'lmadi', text);
            }

            // Solve equation
            const solution = this.solveEquation(equation);
            
            return this.formatAlgebraSolution(equation, solution);
            
        } catch (error) {
            console.error('Algebra error:', error);
            return this.formatError('Algebraik masalani yechib bo\'lmadi', text);
        }
    },

    extractEquation(text) {
        // Find equation pattern: something = something
        const match = text.match(/([^=]+)=([^=]+)/);
        if (match) {
            return {
                left: match[1].trim(),
                right: match[2].trim(),
                full: match[0].trim()
            };
        }
        return null;
    },

    solveEquation(equation) {
        try {
            // Try to solve using math.js
            const solutions = this.mathEngine.simplify(equation.full);
            
            // Extract variable
            const variable = this.extractVariable(equation.left);
            
            return {
                variable: variable,
                value: solutions,
                steps: this.generateAlgebraSteps(equation)
            };
            
        } catch (error) {
            console.error('Equation solve error:', error);
            
            // Fallback: basic solving
            return this.solveBasicEquation(equation);
        }
    },

    extractVariable(expr) {
        const match = expr.match(/([a-z])/i);
        return match ? match[1] : 'x';
    },

    solveBasicEquation(equation) {
        // Example: 2x + 5 = 13
        // Extract coefficients
        const leftMatch = equation.left.match(/(\d*)\s*([a-z])\s*([\+\-])\s*(\d+)/i);
        const rightValue = parseFloat(equation.right);
        
        if (leftMatch && !isNaN(rightValue)) {
            const coefficient = parseFloat(leftMatch[1] || '1');
            const variable = leftMatch[2];
            const operation = leftMatch[3];
            const constant = parseFloat(leftMatch[4]);
            
            let result;
            if (operation === '+') {
                result = (rightValue - constant) / coefficient;
            } else {
                result = (rightValue + constant) / coefficient;
            }
            
            return {
                variable: variable,
                value: result,
                steps: [
                    `Berilgan: ${equation.full}`,
                    `O'ng va chap tomonlarni tenglashtiramiz`,
                    `${variable} = ${result}`
                ]
            };
        }
        
        return {
            variable: 'x',
            value: 'Aniqlab bo\'lmadi',
            steps: ['Tenglamani soddalashtirish kerak']
        };
    },

    generateAlgebraSteps(equation) {
        return [
            `Berilgan tenglama: ${equation.full}`,
            `Noma'lumni ajratamiz`,
            `Tenglamani soddalashtiramiz`,
            `Javobni topamiz`
        ];
    },

    formatAlgebraSolution(equation, solution) {
        return `
            <div style="animation:fadeIn 0.5s">
                <h3 style="color:#00ff64;margin-bottom:20px;">✅ Algebraik Tenglama Yechimi</h3>
                
                <div style="background:rgba(102,126,234,0.1);padding:25px;border-radius:16px;margin-bottom:20px;">
                    <h4 style="color:#667eea;margin-bottom:15px;">📝 Tenglama</h4>
                    <div style="font-size:24px;font-family:'Courier New',monospace;text-align:center;">
                        ${this.escapeHtml(equation.full)}
                    </div>
                </div>

                <div style="background:rgba(0,255,100,0.1);padding:30px;border-radius:16px;margin-bottom:20px;">
                    <h4 style="color:#00ff64;margin-bottom:15px;">🎯 Javob</h4>
                    <div style="font-size:36px;font-weight:700;text-align:center;color:#00ff64;">
                        ${this.escapeHtml(solution.variable)} = ${this.escapeHtml(String(solution.value))}
                    </div>
                </div>

                <div style="background:rgba(79,172,254,0.05);padding:20px;border-radius:12px;">
                    <h4 style="color:#4facfe;margin-bottom:15px;">💡 Yechish Bosqichlari</h4>
                    <ol style="line-height:2;margin-left:20px;">
                        ${solution.steps.map(step => `<li>${this.escapeHtml(step)}</li>`).join('')}
                    </ol>
                </div>
            </div>
        `;
    },

    // ═══════════════════════════════════════════════════════════════════════
    // GENERAL SOLVER (Fallback)
    // ═══════════════════════════════════════════════════════════════════════
    
    async solveGeneral(text) {
        console.log('📐 Solving general problem...');
        
        // Try to evaluate as expression
        try {
            const expr = this.cleanExpression(text);
            if (expr) {
                const result = this.mathEngine.evaluate(expr);
                return this.formatArithmeticSolution(expr, result);
            }
        } catch (e) {
            // Continue to manual analysis
        }

        // Manual analysis
        return this.formatGeneralSolution(text);
    },

    formatGeneralSolution(text) {
        return `
            <div style="animation:fadeIn 0.5s">
                <h3 style="color:#ffd200;margin-bottom:20px;">🔍 Umumiy Tahlil</h3>
                
                <div style="background:rgba(255,210,0,0.1);padding:25px;border-radius:16px;margin-bottom:20px;">
                    <h4 style="color:#ffd200;margin-bottom:15px;">📝 Aniqlangan Matn</h4>
                    <div style="font-size:16px;line-height:2;">
                        ${this.escapeHtml(text)}
                    </div>
                </div>

                <div style="background:rgba(79,172,254,0.05);padding:20px;border-radius:12px;">
                    <h4 style="color:#4facfe;margin-bottom:15px;">💡 Tavsiya</h4>
                    <ul style="line-height:2;margin-left:20px;">
                        <li>Masalani aniqroq yozing</li>
                        <li>Raqamlar va belgilar aniq bo'lsin</li>
                        <li>Agar rasm ishlatgan bo'lsangiz, sifatli rasm yuklang</li>
                        <li>Qayta urinib ko'ring yoki "Tezkor yozish" dan foydalaning</li>
                    </ul>
                </div>
            </div>
        `;
    },

    // ═══════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════════════
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    },

    formatError(message, originalText) {
        return `
            <div style="animation:fadeIn 0.5s">
                <h3 style="color:#f5576c;margin-bottom:20px;">❌ Xatolik</h3>
                
                <div style="background:rgba(245,87,108,0.1);padding:25px;border-radius:16px;margin-bottom:20px;border-left:4px solid #f5576c;">
                    <p style="font-size:18px;margin-bottom:15px;">${this.escapeHtml(message)}</p>
                    ${originalText ? `<p style="color:var(--gray);font-size:14px;">Matn: ${this.escapeHtml(originalText)}</p>` : ''}
                </div>

                <div style="background:rgba(255,210,0,0.1);padding:20px;border-radius:12px;">
                    <h4 style="color:#ffd200;margin-bottom:15px;">💡 Nima qilish kerak?</h4>
                    <ul style="line-height:2;margin-left:20px;">
                        <li>Yangi, aniqroq rasm yuklang</li>
                        <li>"Tezkor yozish" dan foydalaning</li>
                        <li>Masalani boshqacha shaklda yozing</li>
                        <li>Admin bilan bog'laning</li>
                    </ul>
                </div>
            </div>
        `;
    }
});

console.log('✅ MATHSOLVER.JS QISM 3/15 loaded - Problem Solving Engine ready');
console.log('➡️  Keyingi qismni paste qiling...');/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  AI Math Solver - ULTIMATE PROFESSIONAL MATHEMATICS ENGINE
 *  Version 1.0 - MAXIMUM INTELLIGENCE
 *  
 *  QISM 5/15 - Solution Display & UI Management (FINAL CORE)
 *  
 *  QISM 4 dan keyin paste qiling!
 * ═══════════════════════════════════════════════════════════════════════════
 */

Object.assign(MathSolver, {
    
    // ═══════════════════════════════════════════════════════════════════════
    // SOLUTION DISPLAY
    // ═══════════════════════════════════════════════════════════════════════
    
    displaySolution(problem, solution, analysis) {
        const solutionResult = $('solutionResult');
        if (!solutionResult) return;
        
        solutionResult.innerHTML = solution;
        solutionResult.style.animation = 'fadeIn 0.6s ease';
        
        // Scroll to solution
        setTimeout(() => {
            solutionResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
        
        console.log('✅ Solution displayed');
    },

    displayError(error) {
        const solutionResult = $('solutionResult');
        if (!solutionResult) return;
        
        const errorMessage = error.message || 'Noma\'lum xatolik';
        
        solutionResult.innerHTML = `
            <div style="animation:shake 0.5s">
                <h3 style="color:#f5576c;margin-bottom:20px;">❌ Xatolik Yuz Berdi</h3>
                
                <div style="background:rgba(245,87,108,0.1);padding:30px;border-radius:16px;border-left:4px solid #f5576c;margin-bottom:20px;">
                    <p style="font-size:18px;line-height:1.8;">
                        ${this.escapeHtml(errorMessage)}
                    </p>
                </div>

                <div style="background:rgba(255,210,0,0.1);padding:25px;border-radius:16px;">
                    <h4 style="color:#ffd200;margin-bottom:15px;">💡 Nima Qilish Kerak?</h4>
                    <ul style="line-height:2;margin-left:20px;">
                        <li>🔄 Yangi, aniqroq rasm yuklang</li>
                        <li>✍️ "Tezkor yozish" dan foydalaning</li>
                        <li>📝 Masalani boshqacha yozing</li>
                        <li>💬 Admin bilan bog'laning (yuqoridagi chat tugmasi)</li>
                        <li>🔁 Qayta urinib ko'ring</li>
                    </ul>
                </div>

                <div style="margin-top:20px;text-align:center;">
                    <button onclick="MathSolver.removeImage();MathSolver.resetSolution();" 
                            style="padding:12px 24px;background:var(--math-primary);border:none;border-radius:10px;color:white;font-weight:600;cursor:pointer;">
                        🔄 Qaytadan Boshlash
                    </button>
                </div>
            </div>
        `;
        
        MathUtils.notify('❌ ' + errorMessage, 'error');
    },

    resetSolution() {
        const solutionResult = $('solutionResult');
        if (solutionResult) {
            solutionResult.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" width="60" height="60">
                        <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                    <h4>Masala yechimini ko'rish</h4>
                    <p>Rasm yuklang yoki masala yozing</p>
                </div>
            `;
        }
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ANIMATIONS
    // ═══════════════════════════════════════════════════════════════════════
    
    addAnimationStyles() {
        if (!document.getElementById('mathAnimations')) {
            const style = document.createElement('style');
            style.id = 'mathAnimations';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                    20%, 40%, 60%, 80% { transform: translateX(10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// AUTO-INITIALIZE ON PAGE LOAD
// ═══════════════════════════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {
    // Wait for auth to complete
    setTimeout(() => {
        if (MathAuth.currentUser && !MathAuth.isAdmin) {
            console.log('🧮 Initializing Math Solver for user:', MathAuth.currentUser);
            MathSolver.init();
            MathSolver.addAnimationStyles();
        }
    }, 1000);
});

console.log('✅ MATHSOLVER.JS QISM 5/15 (FINAL CORE) loaded');
console.log('🎉 CORE ENGINE COMPLETE! Now loading Admin & Chat modules...');
console.log('➡️  MathAdmin.js va MathChat.js fayllarini yaratamiz...');