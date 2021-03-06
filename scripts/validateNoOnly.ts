import fs from 'fs';
import glob from 'glob';
import path from 'path';
import { redColour, yellowColour, greenColour } from './auto/utils';

let files = glob.sync('**/*.test.?(j|t)s?(x)', { cwd: path.join(__dirname, '../__tests__') });
files = files.map((file) => path.join(__dirname, '../__tests__', file));
const onlyPattern = new RegExp(/(?:describe\.only|it\.only|test\.only)/, 'gm');

let shouldError = false;
const badFiles: string[] = [];
const badPatterns: string[] = [];

for (const file of files) {
  const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
  const fileHasPattern = fileContent.match(onlyPattern);

  if (fileHasPattern && fileHasPattern.length) {
    shouldError = true;
    for (const pattern of fileHasPattern) {
      badFiles.push(file);
      badPatterns.push(pattern);
    }
  }
}

if (shouldError) {
  // eslint-disable-next-line no-console
  console.error(
    [
      `${redColour.format('\nLooks like you left focused tests, I found these hits:')}`,
      `${badPatterns
        .map(
          (pattern, index) =>
            `- ${yellowColour.format(pattern)} \t${pattern.includes('describe') ? '' : '\t'}  in \t ${badFiles[index]}`
        )
        .join('\n')}`,
      `${redColour.format('Please remove all the focused tests!\n')}`
    ].join('\n')
  );
  process.exit(1);
} else {
  console.log(greenColour.format('Awesome, all tests are running!'));
}

process.exit(0);
