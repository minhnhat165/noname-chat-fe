export function generateInitials(name: string) {
  const words = name.split(' ');

  const initials = words.map((word) => {
    if (word.length > 0) {
      return word[0].toUpperCase();
    }
  });

  return initials.join('');
}
