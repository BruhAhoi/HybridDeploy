import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from "../assets/Logo2.jpg";
import Header from '../components/HomePage/Header';
import { fetchStudentTier, fetchTeacherTier } from '../services/userService';
import { RootState } from '../store/store';

// Giả định Tier type
type Tier = {
  tierId: string;
  tierName: string;
  description: string;
};

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const roleName = useSelector((state: RootState) => state.user.roleName); // Lấy từ Redux
  const [tiers, setTiers] = useState<Tier[]>([]);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        let data: Tier[] = [];
        if (roleName === 'User') {
          data = await fetchStudentTier();
        } else if (roleName === 'Teacher') {
          data = await fetchTeacherTier();
        }
        setTiers(data);
      } catch (error) {
        console.error('Error fetching tiers:', error);
      }
    };

    fetchTiers();
  }, [roleName]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#4e71b3] flex flex-col items-center justify-center text-sm">
        <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <div className="mb-4">
            <img src={Logo} alt="logo" className="h-14 mx-auto" />
          </div>

          {/* Hiển thị thông tin gói theo tier */}
          <div className="flex gap-6 justify-center flex-wrap">
            {tiers.map((tier) => (
              <div
                key={tier.tierId}
                className="bg-[#d6e4ff] rounded-xl px-6 py-4 flex flex-col items-center w-64"
              >
                <h2 className="text-xl font-semibold text-center text-blue-800">
                  {tier.tierName.trim()}
                </h2>
                <div className="text-center mt-2 text-sm space-y-1">
                  {tier.description
                    .split(/\s*\/\s*/g) // Tách bằng dấu "/"
                    .map((line, index) => (
                      <li key={index} className="flex items-start gap-2 mb-2">
                        <CheckCircle className="text-green-500 w-4 h-4 mt-1" />
                        <span>{line.trim()}</span>
                      </li>
                    ))}
                </div>
                <button className="mt-4 text-blue-700 border border-blue-700 px-3 py-1 rounded hover:bg-blue-100">
                  Upgrade
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 bg-blue-800 text-white px-8 py-2 rounded-full hover:bg-blue-900"
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
