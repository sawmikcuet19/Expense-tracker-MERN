import React, { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Calendar, X, Shield } from "lucide-react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import { profileStyles } from "../assets/dummyStyles";
import axios from "axios";

const API_BASE = "http://localhost:4000/api";

Modal.setAppElement('#root');

const PasswordInput = memo(({ name, label, value, error, showField, onToggle, onChange, disabled }) => (
  <div>
    <label className={profileStyles.passwordLabel}>
      {label}
    </label>
    <div className={profileStyles.passwordContainer}>
      <input
        type={showField ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`${profileStyles.inputWithError} ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
        disabled={disabled}
        key={`password-input-${name}`}
      />
      <button
        type="button"
        onClick={onToggle}
        className={profileStyles.passwordToggle}
        disabled={disabled}
      >
        {showField ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
    {error && (
      <p className={profileStyles.errorText}>{error}</p>
    )}
  </div>
));

PasswordInput.displayName = 'PasswordInput';

const ProfilePage = ({ user: initialUser, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser || { 
    name: '', 
    email: '',
    joinDate: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({ ...user });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setTempUser(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const togglePasswordVisibility = useCallback((field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const validatePassword = useCallback(() => {
    const errors = {};
    if (!passwordData.current) errors.current = 'Current password is required';
    if (!passwordData.new) {
      errors.new = 'New password is required';
    } else if (passwordData.new.length < 8) {
      errors.new = 'Password must be at least 8 characters';
    }
    if (passwordData.new !== passwordData.confirm) {
      errors.confirm = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  }, [passwordData]);

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({ current: '', new: '', confirm: '' });
    setPasswordErrors({});
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE}/user/password`,
        { 
          currentPassword: passwordData.current, 
          newPassword: passwordData.new 
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (res.data?.success) {
        toast.success(res.data.message || "Password updated successfully!");
        closePasswordModal();
      }
    } catch (err) {
      console.error("Password update error:", err);
      const errorMsg = err.response?.data?.message || "Failed to update password";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.mainContainer}>
        <div className={profileStyles.header}>
          <div className={profileStyles.avatar}>
            <User size={48} className="text-white/60" />
          </div>
          <h2 className={profileStyles.userName}>{user.name}</h2>
          <p className={profileStyles.userEmail}>{user.email}</p>
        </div>

        <div className={profileStyles.content}>
          <div className={profileStyles.grid}>
            <div className={profileStyles.card}>
              <h3 className={profileStyles.cardTitle}>
                <User className={profileStyles.icon} /> Personal Information
              </h3>
              <div className="space-y-4 mt-4">
                <div>
                  <label className={profileStyles.label}>Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={editMode ? tempUser.name : user.name}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={profileStyles.input}
                  />
                </div>
                <div>
                  <label className={profileStyles.label}>Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={editMode ? tempUser.email : user.email}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={profileStyles.input}
                  />
                </div>
              </div>
            </div>

            <div className={profileStyles.card}>
              <h3 className={profileStyles.cardTitle}>
                <Shield className={profileStyles.icon} /> Security
              </h3>
              <div className="space-y-4 mt-4">
                <div className={profileStyles.securityItem}>
                  <div>
                    <p className="font-medium">Password</p>
                    <p className={profileStyles.securityText}>Last changed 3 months ago</p>
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className={profileStyles.changeButton}
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />

      <Modal
        isOpen={showPasswordModal}
        onRequestClose={closePasswordModal}
        contentLabel="Change Password"
        className="modal-content"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
      >
        <div className={profileStyles.modalContent}>
          <div className={profileStyles.modalHeader}>
            <h3 className={profileStyles.modalTitle}>Change Password</h3>
            <button onClick={closePasswordModal} disabled={loading} className="text-gray-500">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <PasswordInput
              name="current"
              label="Current Password"
              value={passwordData.current}
              error={passwordErrors.current}
              showField={showPassword.current}
              onToggle={() => togglePasswordVisibility('current')}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            <PasswordInput
              name="new"
              label="New Password"
              value={passwordData.new}
              error={passwordErrors.new}
              showField={showPassword.new}
              onToggle={() => togglePasswordVisibility('new')}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            <PasswordInput
              name="confirm"
              label="Confirm New Password"
              value={passwordData.confirm}
              error={passwordErrors.confirm}
              showField={showPassword.confirm}
              onToggle={() => togglePasswordVisibility('confirm')}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            <div className="flex gap-3 pt-4">
              <button type="submit" className={profileStyles.buttonPrimary} disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
              <button type="button" onClick={closePasswordModal} className={profileStyles.buttonSecondary} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;