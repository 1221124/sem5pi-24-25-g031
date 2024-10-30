namespace DDDNetCore.Domain.DbLogs;

public class Message
{
    public string Value { get; set; }
    
    public Message(Message message)
    {
        Value = message.Value;
    }
    
    public Message(string value)
    {
        Value = value;
    }
    
    public static implicit operator Message(string value)
    {
        return new Message(value);
    }
    
    public static implicit operator string(Message message)
    {
        return message.Value;
    }
    
}