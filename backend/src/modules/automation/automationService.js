const AutomationRule = require('./AutomationRule');
const Message = require('../message/model');
const socketService = require('../../services/socketService');

const processAutomation = async (userId, contact, messageContent) => {
  try {
    const text = messageContent.toLowerCase().trim();
    
    // 1. Get active rules for this user
    const rules = await AutomationRule.find({ userId, isActive: true });
    
    let matchedRule = null;
    
    // 2. Loop through rules to find a match
    for (const rule of rules) {
      const keyword = rule.keyword.toLowerCase().trim();
      
      if (rule.matchType === 'exact') {
        if (text === keyword) {
          matchedRule = rule;
          break;
        }
      } else if (rule.matchType === 'includes') {
        if (text.includes(keyword)) {
          matchedRule = rule;
          break;
        }
      }
    }
    
    let responseText = '';
    
    if (matchedRule) {
      responseText = matchedRule.replyMessage;
    } else {
      // 3. Fallback / Mock AI Response
      responseText = generateAIResponse(text);
    }
    
    // 4. Create and send auto-reply
    const autoReply = await Message.create({
      userId,
      contactId: contact._id,
      from: 'business',
      to: contact.phone,
      direction: 'outbound',
      content: responseText,
      status: 'sent',
      channel: 'whatsapp',
      metadata: { 
        automated: true, 
        ruleId: matchedRule ? matchedRule._id : 'ai-fallback' 
      }
    });
    
    // 5. Emit via Socket.io
    socketService.emitToUser(userId.toString(), 'message:sent', autoReply);
    
    return autoReply;
  } catch (err) {
    console.error('Automation error:', err);
    return null;
  }
};

const generateAIResponse = (message) => {
  const text = message.toLowerCase();
  
  if (text.includes('price') || text.includes('cost') || text.includes('how much')) {
    return 'Our subscription plans start from ₹999/month. You can view all plans in the Billing section!';
  }
  
  if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
    return 'Hello! I am your Digital Ad Bird assistant. How can I help you today?';
  }
  
  if (text.includes('help') || text.includes('support')) {
    return 'Sure! I can help you with contacts, campaigns, or setting up your Facebook integration. What do you need?';
  }
  
  return 'Thank you for your message! Our team will get back to you shortly. In the meantime, feel free to explore our dashboard.';
};

module.exports = {
  processAutomation
};
