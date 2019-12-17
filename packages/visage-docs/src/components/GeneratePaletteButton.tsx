import { Button, Spinner } from '@byteclaw/visage';
import React, { useCallback, useState } from 'react';

interface GeneratePaletteButtonProps {
  onSuccess(palette: [number, number, number][]): void;
}

export function GeneratePaletteButton({
  onSuccess,
}: GeneratePaletteButtonProps) {
  const [inProgress, setInProgress] = useState(false);
  const colors = useCallback(async () => {
    try {
      setInProgress(true);

      const palette = await fetch('http://colormind.io/api/', {
        method: 'POST',
        body: JSON.stringify({ model: 'ui' }),
      });

      onSuccess((await palette.json()).result);
    } finally {
      setInProgress(false);
    }
  }, [onSuccess]);

  return (
    <Button onClick={inProgress ? undefined : colors} type="button">
      {inProgress ? <Spinner styles={{ mr: 1 }} /> : ''}Random palette
    </Button>
  );
}
