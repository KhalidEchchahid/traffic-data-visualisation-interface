import React from "react";
import { motion } from "framer-motion";
import { Phone, Instagram, Facebook } from "lucide-react";
import { Button } from "./ui/button";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">تواصل معنا</h3>
            <div className="space-y-2">
              <p className="flex items-center text-gray-300">
                <Phone className="mr-2" /> واتساب: 212645557609
              </p>
              <p className="text-gray-400">توصيل مجاني داخل المغرب!</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">تابعنا على مواقع التواصل</h3>
            <div className="flex gap-4">
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                <Button variant="ghost" size="icon" className="text-white hover:text-yellow-400">
                  <Instagram className="w-6 h-6" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                <Button variant="ghost" size="icon" className="text-white hover:text-yellow-400">
                  <Facebook className="w-6 h-6" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
