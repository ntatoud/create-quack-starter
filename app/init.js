import unhandled from 'cli-handle-unhandled';

export default async () => {
  unhandled();

  console.clear();
  console.log();
  console.log('Create a QuackStarter app');
  console.log();
};
