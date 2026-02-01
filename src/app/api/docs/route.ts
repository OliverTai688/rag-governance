import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { MOCK_DOCS } from '@/lib/docs-mock';

export async function GET() {
    try {
        const docsWithContent = MOCK_DOCS.map(doc => {
            const filePath = path.join(process.cwd(), 'docs', doc.fileName);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                return { ...doc, content };
            } catch (err) {
                console.error(`Error reading file ${filePath}:`, err);
                return { ...doc, content: `Error: Could not load content for ${doc.fileName}` };
            }
        });

        return NextResponse.json(docsWithContent);
    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
