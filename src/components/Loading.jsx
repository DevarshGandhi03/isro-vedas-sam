import { motion } from "framer-motion";

const Loading = ({ text = "Loading...", visibilityClass = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center h-screen  ${visibilityClass}`}>
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-4 h-4 bg-blue-500 rounded-full"
            initial={{ y: 0, opacity: 0.3 }}
            animate={{
              y: [-10, 0, -10],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <motion.p 
        className="mt-4 text-gray-800 font-extrabold text-xl animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default Loading;
