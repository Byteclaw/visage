import { Button, List, ListItem, Popover } from '@byteclaw/visage';
import React, { MouseEvent, useCallback, useState } from 'react';

export function ButtonWithPopover() {
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);

  const handleClick = useCallback((e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.target);
  }, []);

  const open = Boolean(anchorEl);

  return (
    <>
      <Button onClick={handleClick}>Pop me</Button>
      <Popover
        allowScrolling
        open={open}
        anchor={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setAnchorEl(null)}
      >
        <List>
          <ListItem button>One</ListItem>
          <ListItem button>Two</ListItem>
          <ListItem button>Three</ListItem>
        </List>
      </Popover>
    </>
  );
}
