export interface Comment {
    userName: string;
    comment: string;
    onGoToGame: () => void;
  }
  
  const comments: Comment[] = [
    {
      userName: "John Doe",
      comment: "This is a fantastic game! I love the graphics and storyline.",
      onGoToGame: () => {
        console.log("Navigating to John's game...");
      },
    },
    {
      userName: "Jane Smith",
      comment: "Could use some improvements, but overall a decent experience.",
      onGoToGame: () => {
        console.log("Navigating to Jane's game...");
      },
    },
    {
      userName: "Alex Johnson",
      comment: "Absolutely loved the gameplay! Can't wait for the next update.",
      onGoToGame: () => {
        console.log("Navigating to Alex's game...");
      },
    },

    {
        userName: "Emily Davis",
        comment: "The puzzles are challenging and fun. Great job!",
        onGoToGame: () => {
            console.log("Navigating to Emily's game...");
        },
    },
    {
        userName: "Michael Brown",
        comment: "I found a few bugs, but the game is still enjoyable.",
        onGoToGame: () => {
            console.log("Navigating to Michael's game...");
        },
    },
    {
        userName: "Sarah Wilson",
        comment: "The multiplayer mode is awesome!",
        onGoToGame: () => {
            console.log("Navigating to Sarah's game...");
        },
    },
    {
        userName: "David Lee",
        comment: "The storyline is captivating. Keep up the good work!",
        onGoToGame: () => {
            console.log("Navigating to David's game...");
        },
    },
    {
        userName: "Laura Martinez",
        comment: "I love the character customization options.",
        onGoToGame: () => {
            console.log("Navigating to Laura's game...");
        },
    },
    {
        userName: "James Anderson",
        comment: "The game is a bit slow on my device.",
        onGoToGame: () => {
            console.log("Navigating to James's game...");
        },
    },
    {
        userName: "Linda Thompson",
        comment: "Great game, but it needs more levels.",
        onGoToGame: () => {
            console.log("Navigating to Linda's game...");
        },
    },
    {
        userName: "Robert Harris",
        comment: "The graphics are stunning!",
        onGoToGame: () => {
            console.log("Navigating to Robert's game...");
        },
    },
    {
        userName: "Karen Clark",
        comment: "I appreciate the frequent updates.",
        onGoToGame: () => {
            console.log("Navigating to Karen's game...");
        },
    },
    {
        userName: "William Lewis",
        comment: "The controls are intuitive and easy to use.",
        onGoToGame: () => {
            console.log("Navigating to William's game...");
        },
    },
];
  export default comments;
  