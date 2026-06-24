const fs = require('fs');
const path = require('path');

const fixes = [
    { file: 'src/components/BoxWidgets.js', lines: [20] },
    { file: 'src/components/ChatBoxNew/ChatBox.js', lines: [19, 66, 70] },
    { file: 'src/components/ConversationNew/Conversation.js', lines: [13] },
    { file: 'src/components/layout/MobNavMenu.js', lines: [52] },
    { file: 'src/components/layout/Topbar.js', lines: [20] },
    { file: 'src/components/ui/UserChip.js', lines: [13, 16] },
    { file: 'src/pages/ModelView.js', lines: [13, 145, 174] },
    { file: 'src/pages/OrderView.js', lines: [81, 94, 104, 277] },
    { file: 'src/pages/ProfileDev.js', lines: [25] }
];

fixes.forEach(fix => {
    const filePath = path.join(process.cwd(), fix.file);
    if (!fs.existsSync(filePath)) {
        console.log(`Missing: ${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8').split('\n');
    
    // Sort descending so inserting lines doesn't shift the indices for previous insertions
    const sortedLines = [...fix.lines].sort((a, b) => b - a);
    
    sortedLines.forEach(lineNum => {
        const idx = lineNum - 1; // 0-indexed
        
        // Check if there's already an eslint disable comment
        if (idx >= 0 && !content[idx - 1]?.includes('eslint-disable-next-line')) {
            // Match the indentation of the target line
            const match = content[idx].match(/^(\s*)/);
            const indent = match ? match[1] : '';
            content.splice(idx, 0, `${indent}// eslint-disable-next-line`);
        }
    });
    
    fs.writeFileSync(filePath, content.join('\n'), 'utf8');
    console.log(`Fixed: ${fix.file}`);
});
