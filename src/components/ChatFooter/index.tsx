import { Input } from "antd";
import React from "react";

interface ChatFooterProps {
  question: string;
  setQuestion: (q: string) => void;
  handleSend: () => void;
}

const ChatFooter = ({ question, setQuestion, handleSend }: ChatFooterProps) => {
  return (
    <div className="chat-box-footer">
      <Input
        placeholder="Để lại thắc mắc của bạn"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onPressEnter={() => handleSend()}
        suffix={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M6.66669 5C6.66669 2.5218 8.15907 1.66666 10 1.66666C11.841 1.66666 13.3334 2.5218 13.3334 5V10C13.3334 12.4782 11.841 13.3333 10 13.3333C8.15907 13.3333 6.66669 12.4782 6.66669 10V5Z"
              stroke="#6C6868"
            />
            <path
              d="M15.8334 12.5C14.1667 15.8333 11.6667 15.8333 10 15.8333C8.33335 15.8333 5.83335 15.8333 4.16669 12.5"
              stroke="#6C6868"
              strokeLinecap="round"
            />
            <path
              d="M10 15.8333V18.3333"
              stroke="#6C6868"
              strokeLinecap="round"
            />
          </svg>
        }
        prefix={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8.00004 1.33334V14.6667M14.6667 8H1.33337"
              stroke="#6C6868"
              strokeLinecap="round"
            />
          </svg>
        }
      />
    </div>
  );
};

export default ChatFooter;
