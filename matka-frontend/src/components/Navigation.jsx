import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ users }) => {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#F5F5DC',
        padding: '0.5rem 1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Link
        to="/"
        style={{
          margin: '0 1rem',
          color: '#2C5F2D',
          fontWeight: 'bold',
          textDecoration: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#D4A017')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
      >
        Home
      </Link>
      {users.map((user) => (
        <Link
          key={user.id}
          to={`/user/${user.id}`}
          style={{
            margin: '0 1rem',
            color: '#4C7C5A',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#D4A017')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
        >
          {user.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
