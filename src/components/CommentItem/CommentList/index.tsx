import React, { useEffect, useState } from 'react';

import type { CommentListItem } from '../../../types/interface';
import CommentItem from '../../CommentItem';
interface Props {
    commentsFromBackend: CommentListItem[];
}

const CommentList: React.FC<Props> = ({ commentsFromBackend }) => {
    const [comments, setComments] = useState<CommentListItem[]>([]);

    useEffect(() => {
        const processedComments = processComments(commentsFromBackend);
        setComments(processedComments);
    }, [commentsFromBackend]);

    const processComments = (comments: CommentListItem[]): CommentListItem[] => {
        const buildCommentTree = (commentList: CommentListItem[], parentId: number | null = null): CommentListItem[] => {
            const nestedComments: CommentListItem[] = [];
            for (const comment of commentList) {
                if ((parentId === null && comment.parentId === null) || (comment.parentId === parentId)) {
                    const nestedComment: CommentListItem = {
                        ...comment,
                        replies: buildCommentTree(commentList, comment.id)
                    };
                    nestedComments.push(nestedComment);
                }
            }
            return nestedComments;
        };

        return buildCommentTree(comments);
    };

    return (
        <div className="comment-list">
            {comments.map(comment => (
                <CommentItem key={comment.id} commentListItem={comment} />
            ))}
        </div>
    );
};

export default CommentList;
