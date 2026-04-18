import TransactionJournalBase from './TransactionJournalBase';
import { TransactionTypes } from '../api/client';

export default () => <TransactionJournalBase type={TransactionTypes.Expense} />;