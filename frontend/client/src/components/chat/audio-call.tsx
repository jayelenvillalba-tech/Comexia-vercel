import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

interface AudioCallProps {
  conversationId: string;
  isCallActive: boolean;
  onEndCall: () => void;
}

type CallState = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';

export default function AudioCall({ conversationId, isCallActive, onEndCall }: AudioCallProps) {
  const { language } = useLanguage();
  const [callState, setCallState] = useState<CallState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start call
  useEffect(() => {
    if (isCallActive && callState === 'idle') {
      initiateCall();
    }
    
    return () => {
      cleanup();
    };
  }, [isCallActive]);
  
  // Call timer
  useEffect(() => {
    if (callState === 'connected') {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      setCallDuration(0);
    }
    
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callState]);
  
  const initiateCall = async () => {
    try {
      setCallState('calling');
      
      // Get user media (audio only)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false 
      });
      
      localStreamRef.current = stream;
      
      // For MVP, simulate connection after 2 seconds
      // In production, this would use WebRTC signaling server
      setTimeout(() => {
        setCallState('connected');
      }, 2000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert(language === 'es' 
        ? 'No se pudo acceder al micrófono. Por favor verifica los permisos.' 
        : 'Could not access microphone. Please check permissions.');
      handleEndCall();
    }
  };
  
  const handleEndCall = () => {
    cleanup();
    setCallState('ended');
    setTimeout(() => {
      onEndCall();
      setCallState('idle');
    }, 1000);
  };
  
  const cleanup = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Clear timer
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  };
  
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!isCallActive && callState === 'idle') return null;
  
  return (
    <div className="fixed top-20 right-4 z-50 bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 rounded-lg shadow-2xl p-4 w-64">
      <div className="text-center">
        {/* Call Status */}
        <div className="mb-4">
          {callState === 'calling' && (
            <>
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-2" />
              <p className="text-white font-medium">
                {language === 'es' ? 'Llamando...' : 'Calling...'}
              </p>
            </>
          )}
          
          {callState === 'ringing' && (
            <>
              <Phone className="w-12 h-12 text-green-400 animate-pulse mx-auto mb-2" />
              <p className="text-white font-medium">
                {language === 'es' ? 'Llamada entrante...' : 'Incoming call...'}
              </p>
            </>
          )}
          
          {callState === 'connected' && (
            <>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-medium mb-1">
                {language === 'es' ? 'En llamada' : 'Connected'}
              </p>
              <p className="text-slate-400 text-sm font-mono">
                {formatDuration(callDuration)}
              </p>
            </>
          )}
          
          {callState === 'ended' && (
            <>
              <PhoneOff className="w-12 h-12 text-red-400 mx-auto mb-2" />
              <p className="text-white font-medium">
                {language === 'es' ? 'Llamada finalizada' : 'Call ended'}
              </p>
            </>
          )}
        </div>
        
        {/* Call Controls */}
        {(callState === 'connected' || callState === 'calling') && (
          <div className="flex justify-center space-x-2">
            <Button
              onClick={toggleMute}
              variant="outline"
              size="sm"
              className={`border-white/20 ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'} hover:bg-white/20`}
            >
              {isMuted ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              onClick={handleEndCall}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              <PhoneOff className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
