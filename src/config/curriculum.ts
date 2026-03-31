import type { CurriculumCategory, CurriculumTopic } from '../types';

export const CATEGORIES: CurriculumCategory[] = [
  { id: 'foundations',  label: 'Foundations',           color: '#5b9cf6', order: 1 },
  { id: 'ml-core',      label: 'ML Core Concepts',       color: '#7b5ea7', order: 2 },
  { id: 'neural-nets',  label: 'Neural Networks',        color: '#e8645a', order: 3 },
  { id: 'deep-learning',label: 'Deep Learning',          color: '#f0c040', order: 4 },
  { id: 'llms',         label: 'Language & LLMs',        color: '#4ec9a0', order: 5 },
  { id: 'vision',       label: 'Computer Vision',        color: '#fb923c', order: 6 },
  { id: 'rl',           label: 'Reinforcement Learning', color: '#a78bfa', order: 7 },
  { id: 'safety',       label: 'AI Safety & Ethics',     color: '#34d399', order: 8 },
  { id: 'research',     label: 'Research Frontiers',     color: '#f472b6', order: 9 },
];

// Each topic has an id used as a stable key in watch history.
// prerequisites lists topic IDs that should ideally be watched first.
// This enables contextual ordering without repeating topics.
export const TOPICS: CurriculumTopic[] = [
  // ── Foundations ──────────────────────────────────────────────────
  { id: 'what-is-ai',        title: 'What is AI?',               category: 'foundations',  prerequisites: [],                    difficulty: 'beginner' },
  { id: 'what-is-ml',        title: 'What is Machine Learning?', category: 'foundations',  prerequisites: ['what-is-ai'],        difficulty: 'beginner' },
  { id: 'data-and-datasets', title: 'Data and Datasets',         category: 'foundations',  prerequisites: ['what-is-ml'],        difficulty: 'beginner' },
  { id: 'features',          title: 'Features and Labels',       category: 'foundations',  prerequisites: ['data-and-datasets'], difficulty: 'beginner' },
  { id: 'train-test-split',  title: 'Train / Test Split',        category: 'foundations',  prerequisites: ['features'],          difficulty: 'beginner' },

  // ── ML Core ──────────────────────────────────────────────────────
  { id: 'supervised-learning',   title: 'Supervised Learning',      category: 'ml-core', prerequisites: ['train-test-split'],       difficulty: 'beginner' },
  { id: 'unsupervised-learning', title: 'Unsupervised Learning',    category: 'ml-core', prerequisites: ['supervised-learning'],    difficulty: 'beginner' },
  { id: 'overfitting',           title: 'Overfitting & Underfitting',category: 'ml-core', prerequisites: ['supervised-learning'],   difficulty: 'intermediate' },
  { id: 'bias-variance',         title: 'Bias-Variance Tradeoff',   category: 'ml-core', prerequisites: ['overfitting'],            difficulty: 'intermediate' },
  { id: 'loss-functions',        title: 'Loss Functions',           category: 'ml-core', prerequisites: ['supervised-learning'],    difficulty: 'intermediate' },
  { id: 'gradient-descent',      title: 'Gradient Descent',         category: 'ml-core', prerequisites: ['loss-functions'],         difficulty: 'intermediate' },

  // ── Neural Networks ───────────────────────────────────────────────
  { id: 'perceptron',          title: 'The Perceptron',              category: 'neural-nets', prerequisites: ['gradient-descent'],    difficulty: 'intermediate' },
  { id: 'activation-fns',      title: 'Activation Functions',       category: 'neural-nets', prerequisites: ['perceptron'],          difficulty: 'intermediate' },
  { id: 'backpropagation',     title: 'Backpropagation',             category: 'neural-nets', prerequisites: ['activation-fns'],      difficulty: 'intermediate' },
  { id: 'learning-rate',       title: 'Learning Rate & Optimizers', category: 'neural-nets', prerequisites: ['backpropagation'],     difficulty: 'intermediate' },
  { id: 'batch-norm',          title: 'Batch Normalization',        category: 'neural-nets', prerequisites: ['learning-rate'],        difficulty: 'advanced' },
  { id: 'dropout',             title: 'Dropout & Regularization',   category: 'neural-nets', prerequisites: ['batch-norm'],          difficulty: 'advanced' },

  // ── Deep Learning ─────────────────────────────────────────────────
  { id: 'cnn',             title: 'Convolutional Neural Networks', category: 'deep-learning', prerequisites: ['dropout'],           difficulty: 'intermediate' },
  { id: 'rnn',             title: 'Recurrent Neural Networks',     category: 'deep-learning', prerequisites: ['dropout'],           difficulty: 'intermediate' },
  { id: 'lstm',            title: 'LSTMs & GRUs',                  category: 'deep-learning', prerequisites: ['rnn'],               difficulty: 'advanced' },
  { id: 'autoencoders',    title: 'Autoencoders',                   category: 'deep-learning', prerequisites: ['dropout'],           difficulty: 'advanced' },
  { id: 'resnets',         title: 'ResNets & Skip Connections',    category: 'deep-learning', prerequisites: ['cnn'],               difficulty: 'advanced' },
  { id: 'transfer-learning', title: 'Transfer Learning',           category: 'deep-learning', prerequisites: ['resnets'],           difficulty: 'intermediate' },
  { id: 'gans',            title: 'Generative Adversarial Networks',category: 'deep-learning', prerequisites: ['autoencoders'],     difficulty: 'advanced' },

  // ── LLMs ─────────────────────────────────────────────────────────
  { id: 'embeddings',       title: 'Word Embeddings',              category: 'llms', prerequisites: ['supervised-learning'],       difficulty: 'intermediate' },
  { id: 'tokenization',     title: 'Tokenization',                 category: 'llms', prerequisites: ['embeddings'],               difficulty: 'beginner' },
  { id: 'attention',        title: 'Attention Mechanism',          category: 'llms', prerequisites: ['lstm'],                     difficulty: 'advanced' },
  { id: 'transformers',     title: 'Transformer Architecture',     category: 'llms', prerequisites: ['attention'],                difficulty: 'advanced' },
  { id: 'bert',             title: 'BERT — Bidirectional Models',  category: 'llms', prerequisites: ['transformers'],             difficulty: 'advanced' },
  { id: 'gpt',              title: 'GPT — Autoregressive Models',  category: 'llms', prerequisites: ['transformers'],             difficulty: 'advanced' },
  { id: 'instruction-tuning', title: 'Instruction Tuning',         category: 'llms', prerequisites: ['gpt'],                     difficulty: 'advanced' },
  { id: 'rlhf',             title: 'RLHF',                         category: 'llms', prerequisites: ['instruction-tuning'],       difficulty: 'research' },
  { id: 'cot',              title: 'Chain-of-Thought Prompting',   category: 'llms', prerequisites: ['gpt'],                     difficulty: 'intermediate' },
  { id: 'rag',              title: 'Retrieval-Augmented Generation',category: 'llms', prerequisites: ['embeddings', 'gpt'],       difficulty: 'advanced' },

  // ── Vision ────────────────────────────────────────────────────────
  { id: 'image-classification', title: 'Image Classification',    category: 'vision', prerequisites: ['cnn'],                   difficulty: 'intermediate' },
  { id: 'object-detection',     title: 'Object Detection',        category: 'vision', prerequisites: ['image-classification'],  difficulty: 'advanced' },
  { id: 'segmentation',         title: 'Semantic Segmentation',   category: 'vision', prerequisites: ['object-detection'],      difficulty: 'advanced' },
  { id: 'diffusion',            title: 'Diffusion Models',        category: 'vision', prerequisites: ['autoencoders', 'gans'],  difficulty: 'research' },
  { id: 'clip',                 title: 'CLIP — Vision + Language',category: 'vision', prerequisites: ['transformers', 'cnn'],   difficulty: 'research' },

  // ── RL ────────────────────────────────────────────────────────────
  { id: 'rl-intro',       title: 'What is Reinforcement Learning?',category: 'rl', prerequisites: ['what-is-ml'],               difficulty: 'intermediate' },
  { id: 'mdp',            title: 'Markov Decision Processes',      category: 'rl', prerequisites: ['rl-intro'],                 difficulty: 'advanced' },
  { id: 'q-learning',     title: 'Q-Learning',                     category: 'rl', prerequisites: ['mdp'],                     difficulty: 'advanced' },
  { id: 'policy-gradient',title: 'Policy Gradient Methods',        category: 'rl', prerequisites: ['q-learning'],              difficulty: 'research' },
  { id: 'alphago',        title: 'AlphaGo & Game Playing AI',     category: 'rl', prerequisites: ['policy-gradient'],          difficulty: 'advanced' },

  // ── Safety ────────────────────────────────────────────────────────
  { id: 'alignment',       title: 'The AI Alignment Problem',     category: 'safety', prerequisites: ['what-is-ai'],            difficulty: 'intermediate' },
  { id: 'ai-bias',         title: 'Bias in AI Systems',           category: 'safety', prerequisites: ['supervised-learning'],   difficulty: 'intermediate' },
  { id: 'interpretability',title: 'Interpretability & XAI',       category: 'safety', prerequisites: ['neural-nets'],           difficulty: 'advanced' },
  { id: 'adversarial',     title: 'Adversarial Attacks',          category: 'safety', prerequisites: ['cnn'],                  difficulty: 'advanced' },
  { id: 'constitutional-ai', title: 'Constitutional AI',          category: 'safety', prerequisites: ['rlhf'],                 difficulty: 'research' },

  // ── Research Frontiers ────────────────────────────────────────────
  { id: 'moe',            title: 'Mixture of Experts',            category: 'research', prerequisites: ['transformers'],        difficulty: 'research' },
  { id: 'mamba',          title: 'Mamba & State Space Models',    category: 'research', prerequisites: ['transformers'],        difficulty: 'research' },
  { id: 'world-models',   title: 'World Models',                  category: 'research', prerequisites: ['rl-intro', 'gpt'],    difficulty: 'research' },
  { id: 'multimodal',     title: 'Multimodal AI',                 category: 'research', prerequisites: ['clip'],               difficulty: 'research' },
  { id: 'ai-agents',      title: 'AI Agents & Tool Use',          category: 'research', prerequisites: ['rag', 'cot'],         difficulty: 'research' },
  { id: 'scaling-laws',   title: 'Scaling Laws',                  category: 'research', prerequisites: ['transformers'],        difficulty: 'research' },
  { id: 'emergent-caps',  title: 'Emergent Capabilities',         category: 'research', prerequisites: ['scaling-laws'],        difficulty: 'research' },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map(c => [c.id, c]));
export const TOPIC_MAP = new Map(TOPICS.map(t => [t.id, t]));
