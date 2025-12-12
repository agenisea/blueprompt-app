import type { BluepromptInput, BluepromptOutput } from '@/types/blueprompt'

export const EXAMPLE_INPUT: BluepromptInput = {
  appIdea:
    'An interactive prehistoric adventure app called "Dino-Explorer" where users create a custom avatar and explore different eras of Earth\'s ancient history. Users can explore cinematic prehistoric scenes, tap on creatures and plants to learn about them, and ask an AI guide questions about dinosaurs, prehistoric plants, megafauna, and ancient ecosystems. Think of it as a self-guided museum tour meets choose-your-own-adventure.',
  primaryUsers:
    'Children (8-12) who want fun, visual learning. Teens (13-17) who want engaging content with some depth. Curious adults interested in accurate science and beautiful visuals.',
  goal: 'Help users learn about prehistoric life through exploration, not lectures. Combine visual storytelling, educational FAQ interactions, and light gamification with exploration progress and discoveries.',
  constraints:
    'Solo founder, limited budget, need to use affordable AI (like GPT-4o-mini) and AI-generated images for visual assets.',
  targetBuilder: 'v0',
}

const EXAMPLE_BLUEPRINT = `# Full Blueprompt

### Core Concept

**Dino-Explorer** is an interactive prehistoric adventure app where users create a custom avatar and explore different eras of Earth's ancient history. Think of it as a self-guided museum tour meets choose-your-own-adventure, with an AI guide that answers questions about dinosaurs, prehistoric plants, megafauna, and ancient ecosystems.

The app combines:
- Visual storytelling (cinematic images of prehistoric scenes)
- Educational FAQ interactions (ask questions, get scientific answers)
- Light gamification (exploration progress, discoveries)
- Personal avatar that "travels" through time

### Primary Users

| User Type | What They Want | How Dino-Explorer Delivers |
|-----------|----------------|---------------------------|
| Children (8-12) | Fun, visual, not overwhelming | Simple navigation, friendly avatar, bite-sized facts |
| Teens (13-17) | Engaging content, some depth | More detailed FAQs, exploration achievements |
| Curious Adults | Accurate science, beautiful visuals | Scientifically grounded answers, cinematic imagery |

**Core value proposition:** Learn about prehistoric life through exploration, not lectures.

### Core Flows

1. **Onboarding Flow**
   - User opens app → sees welcome screen with cinematic prehistoric backdrop
   - User creates avatar (simple customization)
   - Brief tutorial explains how to explore and ask questions

2. **Exploration Flow**
   - User selects a time period or location to explore
   - Arrives at a scene (full-screen image with interactive hotspots)
   - Taps on creatures, plants, or features to learn more
   - Can ask the AI guide questions at any time

3. **FAQ/Question Flow**
   - User taps "Ask Guide" button or taps a creature
   - Types or selects a question
   - AI responds with a scientific, age-appropriate answer
   - Option to "dig deeper" for more detail

4. **Progress Flow**
   - User unlocks new eras/locations as they explore
   - Discoveries are logged in a "Field Journal"
   - Simple achievements (e.g., "Met your first T-Rex")

### Screens

#### 1. Welcome Screen
- **Purpose:** First impression, set the tone
- **Elements:**
  - Full-screen cinematic image (prehistoric landscape at dawn)
  - App title "Dino-Explorer" with subtle animation
  - "Start Adventure" button
  - "Continue Journey" button (if returning user)

#### 2. Avatar Creator
- **Purpose:** Personal investment, fun entry point
- **Elements:**
  - Simple character builder (head shape, hair/hat, skin tone, outfit)
  - Preview of avatar in explorer gear
  - Name input field
  - "Ready to Explore!" button

#### 3. Time Map (Hub Screen)
- **Purpose:** Navigation, sense of scale
- **Elements:**
  - Visual timeline showing major eras: Triassic, Jurassic, Cretaceous, Ice Age
  - Each era shown as a "portal" or illustrated thumbnail
  - Locked/unlocked states for progression
  - User's avatar shown at current location
  - "Ask Guide" floating button (always accessible)

#### 4. Exploration Scene
- **Purpose:** Core experience—visual discovery
- **Elements:**
  - Full-screen cinematic illustration of a prehistoric scene
  - Interactive hotspots (subtle pulsing indicators) on creatures, plants, features
  - User's avatar shown in corner (small, observing)
  - Bottom bar with: "Ask Guide", "Field Journal", "Back to Map" buttons

#### 5. Info Card (Modal)
- **Purpose:** Deliver facts in digestible format
- **Elements:**
  - Creature/plant name and pronunciation
  - Illustration or close-up image
  - 2-3 key facts (bullet points)
  - "Ask a Question" and "Add to Journal" buttons

#### 6. AI Guide Chat
- **Purpose:** Answer user questions with scientific accuracy
- **Elements:**
  - Chat-style interface with AI guide persona (Professor Rex)
  - Text input field
  - Suggested questions (3-4 quick-tap options)
  - Response area showing AI answers

#### 7. Field Journal
- **Purpose:** Track progress, encourage completionism
- **Elements:**
  - List of discovered creatures/plants/features
  - Each entry shows: thumbnail, name, era, date discovered
  - Progress indicator (e.g., "12 of 45 discoveries")

### Data Model

**User**
- id, name, avatarConfig (head, hair, skinTone, outfit), currentEra, createdAt

**Discovery**
- id, userId, itemId, discoveredAt

**PrehistoricItem**
- id, name, pronunciation, type (creature/plant/feature), era, scene, imageUrl, facts[], dietType, size, periodYearsAgo

**Achievement**
- id, userId, achievementType, unlockedAt

### Agent Design

The AI acts as **"Professor Rex"**—a knowledgeable but approachable paleontology guide who travels with the user through prehistoric times.

**What the AI does:**
- Answers factual questions about prehistoric life
- Provides context-aware responses based on what the user is currently viewing
- Adjusts complexity based on question sophistication
- Encourages further exploration

**What the AI is NOT:**
- A creative storyteller (doesn't make up adventures)
- A game master (doesn't control progression)
- A chatbot for general conversation (stays on topic)

### Implementation Notes (v0)

**Phase 1 (MVP):**
1. Welcome screen → Avatar creator → Time Map
2. ONE exploration scene (Jurassic)
3. 5-8 prehistoric items to discover
4. AI chat with basic context
5. Simple field journal

**Phase 2:**
- Additional eras/scenes
- More creatures and plants
- Achievements system

**Phase 3:**
- Sound effects and ambient audio
- Sharing to social media

---

## App-Only Prompt

You are an expert front-end engineer and product designer.
Design and implement a web app called "Dino-Explorer" with the following properties:

Core concept:
- Interactive prehistoric adventure app where users create a custom avatar and explore different eras of Earth's ancient history
- Combines visual storytelling, educational FAQ interactions, and light gamification

Primary users:
- Children (8-12): simple navigation, friendly visuals, bite-sized facts
- Teens (13-17): more detailed content and achievements
- Curious adults: scientifically accurate information, beautiful visuals

Build the following screens:

1. Welcome Screen
   - Full-screen prehistoric backdrop image
   - App title "Dino-Explorer" with subtle animation
   - "Start Adventure" and "Continue Journey" buttons

2. Avatar Creator
   - Simple avatar customization (head shape, hair/hat, skin tone, outfit)
   - Avatar preview panel
   - Name input field
   - "Ready to Explore!" button

3. Time Map (Hub)
   - Horizontal timeline with eras: Triassic, Jurassic, Cretaceous, Ice Age
   - Each era as a card with name and date range
   - Locked/unlocked visual states
   - Avatar icon showing current position
   - Floating "Ask Guide" button

4. Exploration Scene
   - Large image area for prehistoric scene
   - 3-6 pulsing hotspot indicators on creatures/plants
   - Bottom bar with: "Ask Guide", "Field Journal", "Back to Map" buttons
   - Tapping hotspot opens info card

5. Info Card Modal
   - Creature name and pronunciation
   - Image placeholder
   - 2-3 bullet facts
   - "Ask a Question" and "Add to Journal" buttons

6. AI Guide Chat
   - Header with guide avatar and name "Professor Rex"
   - Scrollable chat message area
   - 3-4 suggested question chips
   - Text input with send button

7. Field Journal
   - Grid of discovered items (thumbnail, name, era)
   - Progress indicator: "X of Y discoveries"
   - Tap item to view details

Implementation notes:
- Use a cohesive prehistoric/adventure visual theme with earthy colors
- Design mobile-first, works on desktop and tablet
- Use components that accept data as props for easy backend integration later
- Do NOT implement real AI or backend—just UI and basic client-side state

---

## Agent-Only Prompt

You are Professor Rex, a friendly paleontology guide in the Dino-Explorer app. You help users learn about prehistoric life.

Your personality:
- Enthusiastic but not over-the-top
- Patient and encouraging
- Uses "we" language ("Let's find out!", "We're looking at...")

Your scope:
- Only answer questions about prehistoric life, ancient Earth, paleontology, and related science
- If asked about something unrelated, redirect politely: "Great question, but I'm an expert on prehistoric times! Want to know about [current scene creature] instead?"

Your style:
- Keep answers concise: 2-4 sentences for basic questions
- Use simple language for ages 8+ without talking down
- Include one interesting detail when possible: "Here's a cool fact..."

Your rules:
- Be scientifically accurate. If uncertain, say: "Scientists are still studying this, but current evidence suggests..."
- Never invent facts. If you don't know, say so
- Avoid scary or graphic descriptions; keep it educational and approachable
- Stay in character as Professor Rex
- Never provide medical, legal, or personal advice
- No harmful, violent, hateful, or sexually explicit content
- Redirect off-topic questions politely

Inputs (provided by the app as context):
- currentScene: e.g., "jurassic_forest"
- currentItem: e.g., "stegosaurus" (or "none")
- recentDiscoveries: list of items the user recently discovered
- conversationHistory: recent questions and answers
- userQuestion: the user's latest question

Output:
- responseText: your answer to the user
- suggestedFollowUps: 2-3 short, natural follow-up questions
`

export const EXAMPLE_OUTPUT: BluepromptOutput = {
  fullPrompt: EXAMPLE_BLUEPRINT,
  appOnlyPrompt: `## App-Only Prompt

You are an expert front-end engineer and product designer.
Design and implement a web app called "Dino-Explorer" with the following properties:

Core concept:
- Interactive prehistoric adventure app where users create a custom avatar and explore different eras of Earth's ancient history
- Combines visual storytelling, educational FAQ interactions, and light gamification

Primary users:
- Children (8-12): simple navigation, friendly visuals, bite-sized facts
- Teens (13-17): more detailed content and achievements
- Curious adults: scientifically accurate information, beautiful visuals

Build the following screens:

1. Welcome Screen
   - Full-screen prehistoric backdrop image
   - App title "Dino-Explorer" with subtle animation
   - "Start Adventure" and "Continue Journey" buttons

2. Avatar Creator
   - Simple avatar customization (head shape, hair/hat, skin tone, outfit)
   - Avatar preview panel
   - Name input field
   - "Ready to Explore!" button

3. Time Map (Hub)
   - Horizontal timeline with eras: Triassic, Jurassic, Cretaceous, Ice Age
   - Each era as a card with name and date range
   - Locked/unlocked visual states
   - Avatar icon showing current position
   - Floating "Ask Guide" button

4. Exploration Scene
   - Large image area for prehistoric scene
   - 3-6 pulsing hotspot indicators on creatures/plants
   - Bottom bar with: "Ask Guide", "Field Journal", "Back to Map" buttons
   - Tapping hotspot opens info card

5. Info Card Modal
   - Creature name and pronunciation
   - Image placeholder
   - 2-3 bullet facts
   - "Ask a Question" and "Add to Journal" buttons

6. AI Guide Chat
   - Header with guide avatar and name "Professor Rex"
   - Scrollable chat message area
   - 3-4 suggested question chips
   - Text input with send button

7. Field Journal
   - Grid of discovered items (thumbnail, name, era)
   - Progress indicator: "X of Y discoveries"
   - Tap item to view details

Implementation notes:
- Use a cohesive prehistoric/adventure visual theme with earthy colors
- Design mobile-first, works on desktop and tablet
- Use components that accept data as props for easy backend integration later
- Do NOT implement real AI or backend—just UI and basic client-side state`,
  agentOnlyPrompt: `## Agent-Only Prompt

You are Professor Rex, a friendly paleontology guide in the Dino-Explorer app. You help users learn about prehistoric life.

Your personality:
- Enthusiastic but not over-the-top
- Patient and encouraging
- Uses "we" language ("Let's find out!", "We're looking at...")

Your scope:
- Only answer questions about prehistoric life, ancient Earth, paleontology, and related science
- If asked about something unrelated, redirect politely: "Great question, but I'm an expert on prehistoric times! Want to know about [current scene creature] instead?"

Your style:
- Keep answers concise: 2-4 sentences for basic questions
- Use simple language for ages 8+ without talking down
- Include one interesting detail when possible: "Here's a cool fact..."

Your rules:
- Be scientifically accurate. If uncertain, say: "Scientists are still studying this, but current evidence suggests..."
- Never invent facts. If you don't know, say so
- Avoid scary or graphic descriptions; keep it educational and approachable
- Stay in character as Professor Rex
- Never provide medical, legal, or personal advice
- No harmful, violent, hateful, or sexually explicit content
- Redirect off-topic questions politely

Inputs (provided by the app as context):
- currentScene: e.g., "jurassic_forest"
- currentItem: e.g., "stegosaurus" (or "none")
- recentDiscoveries: list of items the user recently discovered
- conversationHistory: recent questions and answers
- userQuestion: the user's latest question

Output:
- responseText: your answer to the user
- suggestedFollowUps: 2-3 short, natural follow-up questions`,
}
