import chalk from 'chalk';

const logger = {
    info: (msg) => console.log(`${chalk.blue('[INFO]')} ${msg}`),
    success: (msg) => console.log(`${chalk.green('[SUCCESS]')} ${msg}`),
    warn: (msg) => console.log(`${chalk.yellow('[WARN]')} ${msg}`),
    error: (msg) => console.log(`${chalk.red('[ERROR]')} ${msg}`),
    api: (method, url, status, time) => {
        let color = chalk.green;
        if (status >= 400 && status < 500) color = chalk.yellow;
        if (status >= 500) color = chalk.red;
        
        console.log(
            `${chalk.magenta('[API]')} ${chalk.bold(method)} ${url} ${color(status)} ${chalk.gray(`(${time}ms)`)}`
        );
    }
};

export default logger;
