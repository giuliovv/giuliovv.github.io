export interface Stop {
    year: string;
    title: string;
    position: [number, number, number];
    short: string;
    details: string[];
    tags: string[];
}

export const stops: Stop[] = [
    {
        year: "2017",
        title: "Lining up on the grid",
        position: [0, 0, 0],
        short: "Started BSc in Control Engineering at Politecnico di Milano",
        details: [
            "First exposure to control systems, robotics, and a lot of math",
            "Realized I liked systems that move and react, not just static code"
        ],
        tags: ["education", "robotics", "math"]
    },
    {
        year: "2018",
        title: "First pit stop in entrepreneurship",
        position: [10, 0, 20],
        short: "Co-founded an air-quality startup predicting pollution in real time",
        details: [
            "Built a distributed infrastructure at home + university servers",
            "Wrote backend in Go, built an RNN model, designed hardware sensors",
            "Learned what it means to ship something messy but real"
        ],
        tags: ["startup", "go", "ml", "hardware"]
    },
    {
        year: "2020",
        title: "Master’s, switching to race mode",
        position: [20, 0, 40],
        short: "Started MSc in Control Engineering with focus on autonomous driving",
        details: [
            "Thesis on iterative MPC vs reinforcement learning for racing cars",
            "Published a paper and worked with the lab holding the record for the fastest autonomous race car"
        ],
        tags: ["education", "autonomous-driving", "mpc", "rl"]
    },
    {
        year: "2022",
        title: "First lap in Big Tech",
        position: [10, 0, 60],
        short: "Software Engineering intern at Amazon Luxembourg",
        details: [
            "Worked on big data pipelines / infrastructure",
            "Discovered I enjoy owning systems end-to-end, not just writing features"
        ],
        tags: ["work", "big-tech", "data"]
    },
    {
        year: "2023",
        title: "ETH: pushing lap times",
        position: [-10, 0, 50],
        short: "Visiting researcher in autonomous driving at ETH Zurich",
        details: [
            "Worked on racing-oriented control / perception problems",
            "Lots of Docker, robotics, and “if it runs on the robot, it’s real” mindset"
        ],
        tags: ["research", "robotics", "docker"]
    },
    {
        year: "Now",
        title: "On the main straight",
        position: [-20, 0, 20],
        short: "Software/Data Engineer at Amazon London",
        details: [
            "Owning large-scale data systems",
            "Building infra, migrations to Spark 3 / CDK",
            "Thinking about what the next lap looks like"
        ],
        tags: ["work", "spark", "cdk", "aws"]
    }
];
