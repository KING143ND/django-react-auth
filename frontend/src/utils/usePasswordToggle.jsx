import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const usePasswordToggle = () => {
  const [visible, setVisible] = useState(false);
  const inputType = visible ? 'text' : 'password';

  const toggleIcon = visible ? (
    <EyeSlashIcon onClick={() => setVisible(false)} className="h-5 w-5" />
  ) : (
    <EyeIcon onClick={() => setVisible(true)} className="h-5 w-5" />
  );

  return [inputType, toggleIcon];
};

export default usePasswordToggle;
