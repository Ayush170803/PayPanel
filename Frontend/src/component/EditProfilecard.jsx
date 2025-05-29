import React from 'react';

const EditProfileCard = ({ user }) => {
  const { firstName, lastName, photoUrl } = user;

  return (
    <div className="edit-profile-wrapper">
      <div className="edit-profile-card">
        <img src={photoUrl} alt="Profile" className="edit-profile-image" />
        <h2 className="edit-profile-name">{firstName} {lastName}</h2>
      </div>
    </div>
  );
};

export default EditProfileCard;
