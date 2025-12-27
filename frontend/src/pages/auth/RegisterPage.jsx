import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.register({ name, email, password, companyName });
      if (res?.success) {
        alert('Registrasi berhasil, silakan login');
        navigate('/login');
      } else {
        setError(res?.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        {error && <div className="alert-error mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-2">Nama</label>
            <input className="input w-full" value={name} onChange={(e)=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input type="email" className="input w-full" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-2">Perusahaan (opsional)</label>
            <input className="input w-full" value={companyName} onChange={(e)=>setCompanyName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-2">Password</label>
            <input type="password" className="input w-full" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading?'Memproses...':'Register'}</button>
        </form>
        <div className="mt-4 text-sm">
          Sudah punya akun? <Link to="/login" className="text-primary">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
