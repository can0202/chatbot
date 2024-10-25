import { Button } from "antd";

interface ChatSuggestiveProps {
  suggestive: string[];
}

const ChatSuggestive = ({ suggestive }: ChatSuggestiveProps) => {
  return (
    <div className="chat-box-suggestive">
      {suggestive?.length > 0 && (
        <>
          <h5>Gợi ý</h5>
          <ul>
            {suggestive?.map((item, index) => (
              <li key={index}>
                <Button type="text">{item}</Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ChatSuggestive;
