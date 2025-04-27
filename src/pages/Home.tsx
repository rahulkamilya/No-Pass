import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GoogleLogo from "../assets/google-icon-logo-svgrepo-com.svg";

const Home = () => {
  const { currentUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,#00d2de_0%,#3824b4_50%,#151540_100%)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl text-center space-y-8">
        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Secure Password Vault
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Be part of something truly extraordinary. Join thousands of others
            already protecting their digital life with our revolutionary
            password manager.
          </p>
        </div>

        {/* Authentication Button - Fixed positioning */}
        <div className="flex justify-center">
          {currentUser ? (
            <Link to="/dashboard">
              <Button className="text-lg px-8 py-6 bg-white hover:bg-slate-100 text-black rounded-full">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Button
              onClick={signInWithGoogle}
              className="flex text-lg px-8 py-6 bg-white hover:bg-slate-100 text-blue rounded-full gap-3 items-center justify-center"
            >
              <img src={GoogleLogo} alt="google logo" height={18} width={18} />
              Sign in with Google
            </Button>
          )}
        </div>

        {/* User Avatars Section */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex -space-x-4">
            {/* <Avatar className="border-2 border-blue-950 w-10 h-10">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar> */}
            <Avatar className="border-2 border-blue-950 w-10 h-10">
              <AvatarImage
                className="ounded-full w-10 h-10 object-cover rounded-full"
                src="https://www.manishguptaa.me/profile.jpg"
                alt="rahulkapapa"
              />
            </Avatar>
            <Avatar className="border-2 border-blue-950 w-10 h-10">
              <AvatarImage
                className="ounded-full w-10 h-10 object-cover rounded-full"
                src="https://avatars.githubusercontent.com/u/68813555?v=4"
                alt="manish'sson"
              />
            </Avatar>
            <Avatar className="border-2 border-blue-950 w-10 h-10">
              <AvatarImage
                className="ounded-full w-10 h-10 object-cover rounded-full"
                src="https://avatars.githubusercontent.com/u/109842815?v=4"
                alt="rahulkapapa"
              />
            </Avatar>
          </div>
          <span className="text-white text-lg ml-4">
            100+ people trust our vault
          </span>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-8">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Linkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
