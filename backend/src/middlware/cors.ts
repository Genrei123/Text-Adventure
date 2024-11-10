import { CorsOptions } from 'cors';

const corsOptions:CorsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
};

export default corsOptions;