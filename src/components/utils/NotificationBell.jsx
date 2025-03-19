import React, { useState } from 'react';
import { Popover, Badge, IconButton, List, ListItem, ListItemText } from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const notifications = [
    { id: 1, text: 'Có lịch hẹn mới từ khách hàng!' },
    { id: 2, text: 'Xe BMW đã hoàn thành sửa chữa.' },
    { id: 3, text: 'Bạn có một tin nhắn mới từ khách hàng.' },
  ];

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ p: 0, minWidth: '30px', minHeight: '30px' }}
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsRoundedIcon sx={{ fontSize: 20 }} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 1 }}
      >
        <List sx={{ width: 250, maxHeight: 300, overflowY: 'auto' }}>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <ListItem key={notif.id} button onClick={handleClose}>
                <ListItemText primary={notif.text} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Không có thông báo" />
            </ListItem>
          )}
        </List>
      </Popover>
    </>
  );
}
