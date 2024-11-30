import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

const ProductDiscription = () => {
  // Hook to control animations when the component enters the viewport
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true, // Animation triggers only once
    threshold: 0.2, // Trigger when 20% of the component is visible
  });

  // Start animation when inView is true
  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div
      ref={ref} // Reference for the scroll trigger
      className="bg-gradient-to-r from-[#0E1116] to-[#2F343A] text-white p-8 rounded-lg shadow-lg flex-col justify-center items-center"
    >
      <motion.h1
        initial="hidden"
        animate={controls}
        variants={fadeInUp}
        className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
      >
        وصف المنتج
      </motion.h1>
      <motion.p
        initial="hidden"
        animate={controls}
        variants={fadeInUp}
        className="text-lg leading-relaxed mb-6"
      >
        هذا الحذاء هو الخيار المثالي للرجل العصري الذي يهتم بالتفاصيل الدقيقة في
        إطلالاته. تم تصميمه بعناية فائقة ليتماشى مع أحدث صيحات الموضة، دون
        التضحية بالراحة والجودة.
      </motion.p>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={fadeInUp}
        className="bg-[#1A1D21] p-6 rounded-md shadow-lg flex-col justify-center"
      >
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
          المواصفات:
        </h2>
        <ul className="space-y-2 text-gray-300">
          {[
            "جودة فائقة: مصنوع من مواد متينة وعالية الجودة لضمان عمر طويل.",
            "راحة استثنائية: بطانة داخلية ناعمة تدعم القدم وتوفر شعورًا بالراحة طوال اليوم.",
            "صميم مبتكر: مزج مثالي بين الكلاسيكية والحداثة ليتناسب مع مختلف الإطلالات." ,
            "نعل مطاطي وعملي: مقاوم للانزلاق، ما يجعله مثاليًا للاستخدام اليومي أو المناسبات.",
            "تفاصيل دقيقة: خياطة أنيقة ولمسات نهائية راقية تضيف جاذبية إضافية.",
          ].map((item, index) => (
            <motion.li
              key={index}
              initial="hidden"
              animate={controls}
              variants={fadeInUp}
              className="flex items-center gap-2"
            >
              <span>✔️</span> {item}
            </motion.li>
          ))}
          <Image
            src="/images/S5.jpg"
            width={300}
            height={300}
            alt="product"
            className="w-96 h-auto rounded-lg shadow-xl object-cover relative cursor-pointer"
          />
          <motion.li
            initial="hidden"
            animate={controls}
            variants={fadeInUp}
            className="flex items-center gap-2"
          >
            <span>✔️</span> المقاسات: من 40 إلى 44
          </motion.li>
        </ul>
        <ul className="space-y-3 text-gray-300 mt-3">
          {[
            "🔷 لماذا تختار هذا الحذاء؟",
            "✔ لأنه يعكس شخصيتك المميزة وأسلوبك الفريد.",
            "✔ يتيح لك الانتقال بسهولة بين المناسبات الرسمية والخروجات اليومية.",
            "✔ يمنحك الثقة مع كل خطوة تخطوها."
          ].map((item, index) => (
            <motion.li
              key={index}
              initial="hidden"
              animate={controls}
              variants={fadeInUp}
              className="flex items-center gap-2"
            >
               {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={fadeInUp}
        className="text-center mt-8"
      >
        <p className="text-lg text-gray-300">
        ✨ اقتني هذا الحذاء الآن وارتقِ بأناقتك إلى مستوى جديد!
        </p>
        <p className="text-lg text-gray-300">
        📦 التوصيل مجاني وسريع لكل مدن المغرب!
        </p>
        <p className="text-lg text-gray-300">
        🛒 اطلبه الآن ولا تفوّت الفرصة!
        </p>

      </motion.div>
    </div>
  );
};

export default ProductDiscription;
