import { addMessage, getMessages } from '../main';
import { PostedMessage, messages } from '../model';
import { VMContext, Context, u128 } from 'near-sdk-as';

describe('message tests', () => {
    afterEach( () => {
        while(messages.length > 0) {
            messages.pop();
        }
    });

    it('add a message', () => {
        const messageValue = 'hello world';
        const postedMessage = new PostedMessage(messageValue);
        addMessage(messageValue);
        expect(messages.length).toBe(
            1,
            'should only contain one message'
        );
        expect(messages[0]).toStrictEqual(
            postedMessage,
            'message should be "hello world"'
        );
    });

    ////Message is known as premium when the deposit amount greater than 10 * 10^18
    it('add a premium message', () => {
        VMContext.setAttached_deposit(u128.from('10000000000000000000000'));
        addMessage('hello world');
        const mess = getMessages();
        expect(mess[0].premium).toStrictEqual(
            true,
            'should be premium'
        );
    });

    it('retrieves messages', () => {
        const messageValue = 'hello world';
        addMessage(messageValue);
        const postedMessage = new PostedMessage(messageValue);
        const messArr = getMessages();
        expect(messArr.length).toBe(
            1,
            'should be one message'
        );
        expect(messArr).toIncludeEqual(
            postedMessage,
            'messages should include: \n' + postedMessage.toJSON()
        );
    });

    it('only display last 10 messages', () => {
        const messageValue = 'hello world';
        addMessage(messageValue);
        const postedMessage = new PostedMessage(messageValue);

        for(let i: i8 = 0; i < 10; i++) {
            const text = 'message #' + i.toString();
            // const newMessage = new PostedMessage(text)
            // newMessages.push(createMessage(text));
            addMessage(text);
        }

        const messages = getMessages();
        expect(messages.length).toBe(
            10,
            'should only contain 10 message'
        );

        expect(messages).not.toIncludeEqual(
            postedMessage,
            'shouldn\'t contain first element'
        );
    });
});

describe('attacted deposit tests', () => {
    beforeEach(() => {
        VMContext.setAttached_deposit(u128.fromString('0'));
        VMContext.setAccount_balance(u128.fromString('0'));
    });

    it('attaches a deposit to a contract call', () => {
        log('Initial account balance: ' + Context.accountBalance.toString());

        const messageValue = 'hello world';
        addMessage(messageValue);
        VMContext.setAttached_deposit(u128.from('10'));

        log('Attached deposit: 10');
        log('Account balance after deposit: ' + Context.accountBalance.toString());

        expect(Context.accountBalance.toString()).toStrictEqual(
            '10',
            'balance should be 10'
        );
    });
});
