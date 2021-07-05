import React, {useRef} from 'react'
import {Editor, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';

const RTEditor = ({editorState, onChange}) => {

    const editorRef = useRef()

    const focus = () => editorRef.current.focus();
    const _onChange = (newState) => onChange('editorState', newState);
    const handleKeyCommand = (command) => _handleKeyCommand(command);
    const onTab = (e) => _onTab(e);
    const toggleBlockType = (type) => _toggleBlockType(type);
    const toggleInlineStyle = (style) => _toggleInlineStyle(style);

    const _handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            _onChange(newState);
            return true;
        }
        return false;
    }

    const _onTab = (e) => {
        const maxDepth = 4;
        _onChange(RichUtils.onTab(e, editorState, maxDepth));
    }

    const _toggleBlockType = (blockType) => {
        _onChange(
            RichUtils.toggleBlockType(
                editorState,
                blockType
            )
        );
    }

    const _toggleInlineStyle = (inlineStyle) => {
        _onChange(
            RichUtils.toggleInlineStyle(
                editorState,
                inlineStyle
            )
        );
    }

    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
        }
    }

    return (
        <div className="RichEditor-root">
            <BlockStyleControls
                editorState={editorState}
                onToggle={toggleBlockType}
            />
            <InlineStyleControls
                editorState={editorState}
                onToggle={toggleInlineStyle}
            />
            <div className={className} onClick={focus}>
                <Editor
                    blockStyleFn={getBlockStyle}
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    onChange={_onChange}
                    onTab={onTab}
                    placeholder="Your Post"
                    ref={editorRef}
                    spellCheck={true}
                />
            </div>
        </div>
    );
}

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

const StyleButton = ({onToggle, style, active, label}) => {
    const _onToggle = (e) => {
      e.preventDefault();
      onToggle(style)
    }

    let className = 'RichEditor-styleButton';
    if (active) {
        className += ' RichEditor-activeButton';
    }

    return (
        <span className={className} onMouseDown={_onToggle}>
            {label}
        </span>
    )
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

export default RTEditor
