import { Button } from "antd";

interface ChatSuggestiveProps {
  suggestive: string[];
  handleClickSuggest: (item: string) => void;
  isQuestions?: boolean;
}

const ChatSuggestive = ({
  suggestive,
  handleClickSuggest,
  isQuestions = true,
}: ChatSuggestiveProps) => {
  return (
    <div
      className={`chat-box-suggestive-questions ${
        isQuestions ? "questions" : "suggestive"
      }`}
    >
      {suggestive?.length > 0 && (
        <>
          <h5>{isQuestions ? "Vấn đề đang gặp phải" : "Gợi ý"}</h5>
          <ul>
            {suggestive?.map((item, index) => (
              <li key={index}>
                <Button type="text" onClick={() => handleClickSuggest(item)}>
                  {item}
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ChatSuggestive;
