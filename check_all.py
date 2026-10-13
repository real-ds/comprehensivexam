import json
for f in ['app/data/answers/programming-dsa.json','app/data/answers/operating-systems-part1.json','app/data/answers/operating-systems-part2.json','app/data/answers/computer-networks-part1.json','app/data/answers/computer-networks-part2.json','app/data/answers/database-management-systems.json','app/data/answers/theory-of-computation.json','app/data/answers/digital-logic-microprocessor.json','app/data/answers/computer-architecture.json','app/data/answers/web-technologies.json']:
    try:
        d=json.load(open(f,encoding='utf-8'))
        print(f'{f}: {len(d.get("answers",[]))} entries - OK')
    except Exception as e:
        print(f'{f}: ERROR - {e}')