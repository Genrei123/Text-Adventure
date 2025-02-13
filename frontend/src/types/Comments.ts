export interface Comment {
    userName: string;
    comment: string;
    story: string;
    onGoToGame: () => void;
  }
  
const comments: Comment[] = [
    {
        userName: "John Doe",
        comment: "This is a fantastic game! I love the graphics and storyline.",
        story: "The Warhammer Titan",
        onGoToGame: () => {
            console.log("Navigating to John's game...");
        },
    },
    {
        userName: "Jane Smith",
        comment: "Could use some improvements, but overall a decent experience.",
        story: "Secret Wars",
        onGoToGame: () => {
            console.log("Navigating to Jane's game...");
        },
    },
    {
        userName: "Alex Johnson",
        comment: "Absolutely loved the gameplay! Can't wait for the next update.",
        story: "Phantom Menace",
        onGoToGame: () => {
            console.log("Navigating to Alex's game...");
        },
    },
    {
        userName: "Emily Davis",
        comment: "The puzzles are challenging and fun. Great job!",
        story: "The Last Hope",
        onGoToGame: () => {
            console.log("Navigating to Emily's game...");
        },
    },
    {
        userName: "Michael Brown",
        comment: "I found a few bugs, but the game is still enjoyable.",
        story: "X-Men",
        onGoToGame: () => {
            console.log("Navigating to Michael's game...");
        },
    },
    {
        userName: "Sarah Wilson",
        comment: "The multiplayer mode is awesome!",
        story: "Story 6",
        onGoToGame: () => {
            console.log("Navigating to Sarah's game...");
        },
    },
    {
        userName: "David Lee",
        comment: "The storyline is captivating. Keep up the good work!",
        story: "Story 7",
        onGoToGame: () => {
            console.log("Navigating to David's game...");
        },
    },
    {
        userName: "Laura Martinez",
        comment: "I love the character customization options.",
        story: "Story 8",
        onGoToGame: () => {
            console.log("Navigating to Laura's game...");
        },
    },
    {
        userName: "James Anderson",
        comment: "The game is a bit slow on my device.",
        story: "Story 9",
        onGoToGame: () => {
            console.log("Navigating to James's game...");
        },
    },
    {
        userName: "Linda Thompson",
        comment: "Great game, but it needs more levels.",
        story: "Story 10",
        onGoToGame: () => {
            console.log("Navigating to Linda's game...");
        },
    },
    {
        userName: "Robert Harris",
        comment: "The graphics are stunning!",
        story: "Story 11",
        onGoToGame: () => {
            console.log("Navigating to Robert's game...");
        },
    },
    {
        userName: "Karen Clark",
        comment: "I appreciate the frequent updates.",
        story: "Story 12",
        onGoToGame: () => {
            console.log("Navigating to Karen's game...");
        },
    },
    {
        userName: "William Lewis",
        comment: "The controls are intuitive and easy to use.",
        story: "Story 13",
        onGoToGame: () => {
            console.log("Navigating to William's game...");
        },
    },
];
  export default comments;
  