import { RootState } from '../../store';
import { promotePiece } from '../../store/gameSlice';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { getPieceImage } from '../../utils/pieces';

const PromotionChoice: React.FC = () => {
    const color = useAppSelector((state: RootState) => state.game.toMove);
    const dispatch = useAppDispatch();
    return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2">
            <img className="w-full h-full" src={getPieceImage(color, 'queen')} onClick={() => dispatch(promotePiece({pieceType: 'queen'}))}/>
            <img className="w-full h-full" src={getPieceImage(color, 'rook')} onClick={() => dispatch(promotePiece({pieceType: 'rook'}))}/>
            <img className="w-full h-full" src={getPieceImage(color, 'bishop')} onClick={() => dispatch(promotePiece({pieceType: 'bishop'}))}/>
            <img className="w-full h-full" src={getPieceImage(color, 'knight')} onClick={() => dispatch(promotePiece({pieceType: 'knight'}))}/>
        </div>
    );
}

export default PromotionChoice;